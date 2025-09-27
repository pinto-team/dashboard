import type { ApiResponse } from '@/shared/api/types'
import type { SocialLinkKey } from '@/shared/constants/socialLinks'
import type { LocalizedValue } from '@/shared/utils/localized'

export type LocalizedField = LocalizedValue

export type SocialLinks = Partial<Record<SocialLinkKey, string | null | undefined>>
export type SocialLinksPayload = Partial<Record<SocialLinkKey, string>>

export interface BrandData {
    id: string
    name: LocalizedField
    description?: LocalizedField | null
    website_url?: string | null
    logo?: string | null
    logo_id?: string | null
    slug: string
    is_active: boolean
    social_links?: SocialLinks | null
    issued_at: string
    updated_at: string | null
}

export interface CreateBrandRequest {
    name: Record<string, string>
    description?: Record<string, string>
    website_url?: string
    logo_id?: string
    slug: string
    is_active: boolean
    social_links?: SocialLinksPayload
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>

export type BrandResponse = ApiResponse<BrandData>
export type BrandListResponse = ApiResponse<BrandData[]>

export interface BrandFormValues {
    name: Record<string, string>
    description: Record<string, string>
    slug: string
    website_url: string
    is_active: boolean
    logo_id?: string
    social_links: SocialLinksPayload
}

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
