import type { ApiResponse } from "@/types/apiResponse";
import type { Maintenance } from "./types/setting";
import type { APIContext } from "astro";
import { createApi } from "./lib/api";
import { createMemoCache } from "./lib/memoCache";

// Process-wide cache (lives as long as the Astro Node worker).
// 60s TTL matches backend Cache-Control: with a typical load, we go from
// "1 backend call per SSR request" to "1 call per 60s per worker".
const MAINTENANCE_TTL_MS = 60_000;
const maintenanceCache = createMemoCache<boolean>(MAINTENANCE_TTL_MS);

export const onRequest = async (
  context: APIContext,
  next: () => Promise<Response>
): Promise<Response> => {
  const { url, request, locals } = context;

  const lang =
    url.pathname.split("/")[1] ||
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    "es";

  locals.api = createApi(lang);

  let isMaintenance: boolean;

  try {
    isMaintenance = await maintenanceCache.fetch(async () => {
      const api = createApi(lang);
      const { data } = await api.get<ApiResponse<Maintenance>>("api/client/maintenance");
      return Boolean(data.data?.value);
    });
  } catch (error) {
    const err = error as { code?: string; response?: { status?: number } };
    if (err.code === "ECONNREFUSED") {
      console.error(
        `[middleware] Backend unreachable. Start it with: cd AlmhaBackendV2 && php artisan serve`
      );
    } else {
      console.error(
        `[middleware] Maintenance check failed (status=${err.response?.status ?? "?"})`
      );
    }
    // Fail-open: let the user reach the site rather than blocking on a backend hiccup.
    isMaintenance = false;
  }

  const isMaintenancePage = url.pathname.includes("/maintenance");

  if (isMaintenance && !isMaintenancePage) {
    return context.redirect(`/${lang}/maintenance`, 307);
  }
  if (!isMaintenance && isMaintenancePage) {
    return context.redirect(`/${lang}/`, 307);
  }

  return next();
};
