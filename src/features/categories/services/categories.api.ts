import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type {
    CategoryListParams,
    CategoryListResponse,
    CategoryResponse,
    CreateCategoryRequest,
    ReorderCategories,
    ReorderCategoryItem,
    UpdateCategoryRequest,
    UUID,
} from '@/features/categories/model/types'

export const categoriesApiService = {
    list(params?: CategoryListParams) {
        const { parent_id: _parentId, ...query } = params ?? {}
        return catalogClient.get<CategoryListResponse>(API_ROUTES.CATEGORIES.ROOT, {
            params: query,
        })
    },

    get(id: UUID) {
        return catalogClient.get<CategoryResponse>(API_ROUTES.CATEGORIES.BY_ID(id))
    },

    getBySlug(slug: string) {
        return catalogClient.get<CategoryResponse>(API_ROUTES.CATEGORIES.BY_SLUG(slug))
    },

    create(payload: CreateCategoryRequest) {
        return catalogClient.post<CategoryResponse>(API_ROUTES.CATEGORIES.ROOT, payload)
    },

    update(id: UUID, payload: UpdateCategoryRequest) {
        return catalogClient.put<CategoryResponse>(API_ROUTES.CATEGORIES.BY_ID(id), payload)
    },

    reorderOne(id: UUID, payload: ReorderCategoryItem) {
        return catalogClient.put<void>(API_ROUTES.CATEGORIES.REORDER_SINGLE(id), payload)
    },

    reorderMany(payload: ReorderCategories) {
        return catalogClient.put<void>(API_ROUTES.CATEGORIES.REORDER_BULK, payload)
    },

    remove(id: UUID) {
        return catalogClient.delete<void>(API_ROUTES.CATEGORIES.BY_ID(id))
    },
}
