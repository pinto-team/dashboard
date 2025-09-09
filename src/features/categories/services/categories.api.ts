import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type {
    CategoryData,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    ReorderCategory,
} from '@/features/categories/model/types'

export type UUID = string

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    total_pages: number
}

export interface ApiSuccessSingle<T> {
    data: T
    meta?: { pagination?: PaginationMeta; [k: string]: any }
}

export interface ApiSuccessList<T> {
    data: T[]
    meta?: { pagination: PaginationMeta; [k: string]: any }
}

export interface ListCategoriesParams {
    parent_id?: UUID | null
    page?: number
    limit?: number
}

export const categoriesApiService = {
    list(params: ListCategoriesParams) {
        return catalogClient.get<ApiSuccessList<CategoryData>>(API_ROUTES.CATEGORIES.ROOT, {
            params,
        })
    },

    get(id: UUID) {
        return catalogClient.get<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.BY_ID(id))
    },

    create(payload: CreateCategoryRequest) {
        return catalogClient.post<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.ROOT, payload)
    },

    update(id: UUID, payload: UpdateCategoryRequest) {
        return catalogClient.put<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.BY_ID(id), payload)
    },

    patchOrder(id: UUID, order: number) {
        return catalogClient.patch<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.ORDER(id), { order })
    },

    reorderMany(payload: ReorderCategory[]) {
        return catalogClient.put<ApiSuccessList<CategoryData>>(API_ROUTES.CATEGORIES.REORDER, payload)
    },

    reorderOne(id: UUID, payload: { parent_id?: UUID | null; order: number }) {
        return catalogClient.put<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.REORDER_BY_ID(id), payload)
    },

    remove(id: UUID) {
        return catalogClient.delete<{ data: Record<string, string>; meta?: Record<string, any> }>(
            API_ROUTES.CATEGORIES.BY_ID(id),
        )
    },
}
