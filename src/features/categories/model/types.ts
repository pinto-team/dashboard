import type { ApiResponse } from '@/shared/api/types'
import type { LocalizedValue } from '@/shared/utils/localized'

export type UUID = string

export interface CategoryData {
    id: UUID
    name: LocalizedValue
    description?: LocalizedValue | null
    parent_id: UUID | null
    slug: string
    sort_index: number
    image_id?: UUID | null
    image?: string | null
    is_active: boolean
    issued_at: string
    updated_at: string | null
}

export interface CategoryListParams {
    offset?: number
    limit?: number
    parent_id?: UUID | null
}

export interface CategoryPayloadBase {
    name: Record<string, string>
    description?: Record<string, string>
    parent_id?: UUID | null
    slug: string
    sort_index?: number
    image_id?: UUID | null
    is_active?: boolean
}

export type CreateCategoryRequest = CategoryPayloadBase

export type UpdateCategoryRequest = Partial<CategoryPayloadBase>

export interface CategoryFormValues {
    name: Record<string, string>
    description: Record<string, string>
    slug: string
    parent_id: UUID | null
    sort_index: number
    image_id?: UUID | null | string
    is_active: boolean
}

export type CategoryResponse = ApiResponse<CategoryData>
export type CategoryListResponse = ApiResponse<CategoryData[]>
