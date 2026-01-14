import type { APIContext } from "astro";
import { createApi } from "./lib/api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Maintenance } from "./types/setting";

export const onRequest = async (
  context: APIContext,
  next: () => Promise<Response>
): Promise<Response> => {
  const { url, request, locals } = context;

  // 1️⃣ Detectar idioma (orden correcto)
  const lang = url.pathname.split("/")[1] ||
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || "es";

  locals.api = createApi(lang);

  const api = createApi(lang);

  try {
    const { data } = await api.get<ApiResponse<Maintenance>>("api/client/maintenance");
    const maintenance = data.data;

    const isMaintenance = maintenance?.value
    const isMaintenancePage = url.pathname.includes("/maintenance");

    if (isMaintenance && !isMaintenancePage) {
      // Retornamos una respuesta 503 (Servicio no disponible) para SEO
      return context.redirect(`/${lang}/maintenance`, 307);
    } else if (!isMaintenance && isMaintenancePage) {
      return context.redirect(`/${lang}/`, 307);
    }

  } catch (error: any) {
    console.error("Error fetching design settings in middleware:", {
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }

  return next();
};
