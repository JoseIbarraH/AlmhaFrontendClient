import type { APIContext } from "astro";
import { createApi } from "./lib/api";
import type { DesignSettingsResponse } from "@/types/design";
import type { ApiResponse } from "@/types/apiResponse";

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
        // 3️⃣ Llamada segura a la API
        const { data } = await api.get<ApiResponse<DesignSettingsResponse>>("api/client/design");

        locals.global = {design: data.data};

    } catch (error: any) {
        console.error("Error fetching design settings in middleware:", {
            status: error?.response?.status,
            data: error?.response?.data,
        });

        locals.global = {
            design: null,
        };
    }

    return next();
};
