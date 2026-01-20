import type { AxiosInstance } from "axios";
import type { ApiResponse, Default, Category, PaginatedResponse } from "@/types/apiResponse";

interface FetchListDataParams {
    api: AxiosInstance;
    endpoint: string;
    searchParams: URLSearchParams;
}

interface FetchListDataResult<T> {
    categories: Category[];
    items: T[];
    pagination: PaginatedResponse<T> | null;
}

export async function fetchListData<T>({api, endpoint, searchParams}: FetchListDataParams): Promise<FetchListDataResult<T>> {
    const page = searchParams.get("page") || "1";
    const categoryFilter = searchParams.get("category") || "";
    const searchValue = searchParams.get("search") || "";

    // Build query params
    const params: Record<string, string> = {
        page,
    };

    if (categoryFilter) {
        params["filter[category_code]"] = categoryFilter;
    }

    if (searchValue) {
        params["filter[search]"] = searchValue;
    }

    try {
        const { data } = await api.get<ApiResponse<Default<T>>>(endpoint, { params });

        return {
            categories: data.data.categories || [],
            items: data.data.pagination.data,
            pagination: data.data.pagination,
        };
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}`, error);
        return {
            categories: [],
            items: [],
            pagination: null,
        };
    }
}
