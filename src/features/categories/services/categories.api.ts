import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type {
    CategoryData,
    CreateCategoryRequest,
    UpdateCategoryRequest,
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
     * DELETE /categories/{id}
     * حذف آیتم و فشرده‌سازی order خواهر-برادرها توسط سرور.
     */
    remove(id: UUID) {
        return catalogClient.delete<{ data: Record<string, string>; meta?: Record<string, any> }>(
            API_ROUTES.CATEGORIES.BY_ID(id),
        )
    },
}
