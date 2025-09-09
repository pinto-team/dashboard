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
    // در صورت نیاز بعداً می‌تونیم name رو هم اضافه کنیم
}

export const categoriesApiService = {
    /**
     * GET /categories?parent_id=&page=&limit=
     * مرتب‌سازی خروجی طبق قرارداد سرور بر اساس order صعودی انجام می‌شود.
     */
    list(params: ListCategoriesParams) {
        return catalogClient.get<ApiSuccessList<CategoryData>>(API_ROUTES.CATEGORIES.ROOT, {
            params,
        })
    },

    /**
     * GET /categories/{id}
     */
    get(id: UUID) {
        return catalogClient.get<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.BY_ID(id))
    },

    /**
     * POST /categories
     * اگر order ارسال نشود، سرور آیتم را انتهای لیست والد قرار می‌دهد.
     */
    create(payload: CreateCategoryRequest) {
        return catalogClient.post<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.ROOT, payload)
    },

    /**
     * PUT /categories/{id}
     * برای جابه‌جایی:
     *  - همان والد: { order: newIndex }
     *  - والد جدید: { parent_id: NEW_PARENT, order: newIndex }
     * برای ویرایش Inline: { name?, description?, image_url? }
     */
    update(id: UUID, payload: UpdateCategoryRequest) {
        return catalogClient.put<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.BY_ID(id), payload)
    },

    /**
     * PATCH /categories/{id}/order
     */
    patchOrder(id: UUID, order: number) {
        return catalogClient.patch<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.ORDER(id), { order })
    },

    /**
     * PUT /categories/reorder
     */
    reorderMany(payload: ReorderCategory[]) {
        return catalogClient.put<ApiSuccessList<CategoryData>>(API_ROUTES.CATEGORIES.REORDER, payload)
    },

    /**
     * PUT /categories/{id}/reorder
     */
    reorderOne(id: UUID, payload: { parent_id?: UUID | null; order: number }) {
        return catalogClient.put<ApiSuccessSingle<CategoryData>>(API_ROUTES.CATEGORIES.REORDER_BY_ID(id), payload)
    },

    /**
     * DELETE /categories/{id}
     * حذف آیتم و فشرده‌سازی order خواهر-برادرها توسط سرور.
     */
    remove(id: UUID) {
        return catalogClient.delete<{ data: Record<string, string>; meta?: Record<string, any> }>(
            API_ROUTES.CATEGORIES.BY_ID(id),
        )
    },
}
