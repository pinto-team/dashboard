import type { ApiResponse } from '@/shared/api/types'

export interface CategoryData {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    image_id?: string | null
    parent_id?: string | null
    created_at: string
    updated_at: string
}

export interface CreateCategoryRequest {
    name: string
    description?: string
    parent_id?: string
    image_id?: string
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>

export type CategoryResponse = ApiResponse<CategoryData>
export type CategoryListResponse = ApiResponse<CategoryData[]>
