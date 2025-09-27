/** Unique identifier for resources */
export type Identifier = string | number

/** Pagination metadata contract */
export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
}

/** Meta info always returned by API */
export interface ApiMeta {
    message: string
    status: string
    code: number | string
    pagination?: Pagination
    method?: string
    path?: string
    timestamp?: string
    trace_id?: string
    request_id?: string
    host?: string
}

/** Generic envelope for all API responses */
export interface ApiResponse<T = unknown> {
    data: T
    meta: ApiMeta
}
