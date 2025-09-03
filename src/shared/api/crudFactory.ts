import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from './types'

export function createCrudApi<TData, TCreate, TUpdate = Partial<TCreate>>(
    client: AxiosInstance,
    basePath: string,
) {
    return {
        list: (params?: unknown, cfg?: AxiosRequestConfig) =>
            client.get<ApiResponse<TData[]>>(basePath, { params, ...cfg }).then(r => r.data),

        detail: (id: string | number, cfg?: AxiosRequestConfig) =>
            client.get<ApiResponse<TData>>(`${basePath}/${id}`, cfg).then(r => r.data),

        create: (payload: TCreate, cfg?: AxiosRequestConfig) =>
            client.post<ApiResponse<TData>>(basePath, payload, cfg).then(r => r.data),

        update: (id: string | number, payload: TUpdate, cfg?: AxiosRequestConfig) =>
            client.put<ApiResponse<TData>>(`${basePath}/${id}`, payload, cfg).then(r => r.data),

        remove: (id: string | number, cfg?: AxiosRequestConfig) =>
            client.delete<ApiResponse<void>>(`${basePath}/${id}`, cfg).then((r) => r.data),
    }
}
