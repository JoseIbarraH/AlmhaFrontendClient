export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Default<T> {
  filters: Filters
  pagination: PaginatedResponse<T>
  stats: Stats
}

export interface PaginatedResponse<T = any> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface Stats {
  total: number
  totalActivated: number
  totalDeactivated: number
  lastCreated: number
}

export interface Filters {
  search?: string
}
