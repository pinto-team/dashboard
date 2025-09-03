import type { ApiResponse } from '@/shared/api/types'

export interface BrandData {
    name: string
    description: string
    country: string
    website: string
    logo_url: string
    id: string
    created_at: string // ISO date
    updated_at: string // ISO date
}

export interface CreateBrandRequest {
    name: string
    description: string
    country: string
    website: string
    logo_url: string // uuid
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>

    export type BrandResponse = ApiResponse<BrandData>
    export type BrandListResponse = ApiResponse<BrandData[]>
