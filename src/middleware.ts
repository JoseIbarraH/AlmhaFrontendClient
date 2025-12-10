import type { APIContext } from 'astro';

import api from './lib/api';
import type { DesignSettingsResponse } from "@/types/design"
import type { ApiResponse } from "@/types/apiResponse"

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
