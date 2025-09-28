import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from './types'
import type { CrudApi, ListParams } from './crudFactory' // ← نوع‌ها را از crudFactory بگیر

/**
 * تولید هوک‌های CRUD با تایپ کامل
 * @param key کلید اصلی کش برای React Query
 * @param api یک آبجکت برگردانده شده از createCrudApi
 */
export function createCrudHooks<
    TData extends { id: string | number },
    TCreate,
    TUpdate,
    TParams extends ListParams = ListParams
>(
    key: string,
    api: CrudApi<TData, TCreate, TUpdate, TParams>,
) {
    return {
        /**
         * 📄 گرفتن لیست
         */
        useList: (params?: TParams) =>
            useQuery<ApiResponse<TData[]>, AxiosError<ApiResponse<unknown>>>({
                queryKey: [key, 'list', params ? JSON.stringify(params) : undefined],
                queryFn: () => api.list(params),
            }),

        /**
         * 🔍 گرفتن جزییات
         */
        useDetail: (id: string | number) =>
            useQuery<ApiResponse<TData>, AxiosError<ApiResponse<unknown>>>({
                queryKey: [key, 'detail', id],
                queryFn: () => api.detail(id),
                enabled: id !== undefined && id !== null && `${id}`.length > 0,
            }),

        /**
         * ➕ ایجاد
         */
        useCreate: () => {
            const qc = useQueryClient()
            return useMutation<ApiResponse<TData>, AxiosError<ApiResponse<unknown>>, TCreate>({
                mutationFn: api.create,
                onSuccess: (data) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    const id = data.data?.id
                    if (id !== undefined && id !== null) {
                        qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                    }
                },
            })
        },

        /**
         * ✏️ بروزرسانی
         */
        useUpdate: () => {
            const qc = useQueryClient()
            return useMutation<
                ApiResponse<TData>,
                AxiosError<ApiResponse<unknown>>,
                { id: string | number; payload: TUpdate }
            >({
                mutationFn: ({ id, payload }) => api.update(id, payload),
                onSuccess: (_, { id }) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                },
            })
        },

        /**
         * 🗑️ حذف
         */
        useDelete: () => {
            const qc = useQueryClient()
            return useMutation<
                ApiResponse<void>,
                AxiosError<ApiResponse<unknown>>,
                string | number
            >({
                mutationFn: api.remove,
                onSuccess: (_, id) => {
                    qc.invalidateQueries({ queryKey: [key, 'list'] })
                    qc.invalidateQueries({ queryKey: [key, 'detail', id] })
                },
            })
        },
    }
}
