import type { AxiosInstance } from "axios";
import type { Carousel, Procedure, Settings } from "@/types/navbar";
import { createKeyedMemoCache } from "./memoCache";

export interface NavbarData {
  carousel: Carousel[];
  topProcedure: Procedure[];
  procedures: Record<string, Procedure[]>;
  settings: Settings | null;
}

const EMPTY: NavbarData = {
  carousel: [],
  topProcedure: [],
  procedures: {},
  settings: null,
};

// One entry per language. 5-minute TTL matches backend Cache-Control: max-age=300.
const NAVBAR_TTL_MS = 5 * 60 * 1000;
const cache = createKeyedMemoCache<NavbarData>(NAVBAR_TTL_MS);

export async function getNavbarData(api: AxiosInstance, lang: string): Promise<NavbarData> {
  try {
    return await cache.fetch(lang, async () => {
      const { data } = await api.get("api/client/navbar-data");
      const response = data?.data ?? {};
      return {
        carousel: response.carousel ?? [],
        topProcedure: response.topProcedure ?? [],
        procedures: response.procedures ?? {},
        settings: response.settings ?? null,
      };
    });
  } catch (error) {
    const err = error as { code?: string; response?: { status?: number } };
    if (err.code === "ECONNREFUSED") {
      console.error(
        `[navbar] Backend unreachable at ${import.meta.env.PUBLIC_API_URL}. Is it running?`
      );
    } else {
      console.error(
        `[navbar] Failed to fetch navbar data (status=${err.response?.status ?? "?"})`
      );
    }
    return EMPTY;
  }
}

export function invalidateNavbarCache(lang?: string): void {
  cache.invalidate(lang);
}
