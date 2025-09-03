import type {ApiResponse, Pagination} from '@/shared/api/types'

export interface BrandData {
    id: string
    name: string
    description?: string | null
    country?: string | null
    website?: string | null
    logo_url?: string | null
    logo_id?: string | null
    created_at: string
    updated_at: string
}

export interface CreateBrandRequest {
    name: string
    description?: string
    country?: string
    website?: string
    logo_id?: string
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>

export type BrandResponse = ApiResponse<BrandData>
export type BrandListResponse = ApiResponse<BrandData[]>


export interface UploadFilesResponse {
    files: Array<{
        id: string
        url: string
        filename: string
        content_type: string
        size: number
        created_at: string
    }>
}
