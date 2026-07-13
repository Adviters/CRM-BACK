export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface ApiErrorBody {
  statusCode: number
  message: string | string[]
  error?: string
}
