import type { ApiResponse } from '@/shared/api/types'

export interface CategoryData {
    name: string
    description: string
    parent_id: string // uuid
    image_url: string
    id: string // uuid
    created_at: string // ISO date
    updated_at: string // ISO date
}

export interface CreateCategoryRequest {
    name: string
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>

    export type CategoryResponse = ApiResponse<CategoryData>
    export type CategoryListResponse = ApiResponse<CategoryData[]>
