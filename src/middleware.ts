// Importa solo los tipos necesarios de Astro: APIContext
import type { APIContext } from 'astro';

// Importa tus utilidades y tipos
import api from './lib/api';
import type { DesignSettingsResponse } from "@/types/design"
import type { ApiResponse } from "@/types/apiResponse"


// Define la función `onRequest`.
// Usamos el tipo estándar `Response` (del entorno de ejecución) para tipificar la función de retorno.
export const onRequest = async (
    context: APIContext,
    next: () => Promise<Response>
): Promise<Response> => {
    try {
        const { data } = await api.get<ApiResponse<DesignSettingsResponse>>('api/design/client');
        const design = data.data;

        context.locals.global = {
            design: design,
        };

    } catch (error) {
        console.error("Error fetching design settings in middleware:", error);
    }

    return next();
};
