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
  last_three?: T[];
}

export async function fetchListData<T>({ api, endpoint, searchParams }: FetchListDataParams): Promise<FetchListDataResult<T>> {
  const page = searchParams.get("page") || "1";
  const categoryFilter = searchParams.get("category") || "";
  const searchValue = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

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

  if (sort) {
    params["sort"] = sort;
  }

  try {
    const { data } = await api.get<ApiResponse<Default<T>>>(endpoint, { params });

    // Defensive: if the backend ever serializes an empty collection to `{}`
    // instead of `[]`, fall back to an empty array so downstream `.map` calls
    // don't crash.
    const toArray = <U>(v: unknown): U[] => (Array.isArray(v) ? (v as U[]) : []);

    return {
      categories: toArray<Category>(data.data.categories),
      items: toArray<T>(data.data.pagination?.data),
      pagination: data.data.pagination ?? null,
      last_three: toArray<T>(data.data.last_three),
    };
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}`, error);
    return {
      categories: [],
      items: [],
      pagination: null,
      last_three: [],
    };
  }
}
