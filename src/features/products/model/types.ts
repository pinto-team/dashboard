import type { ApiResponse } from '@/shared/api/types'

export interface ProductData {
    sku: string
    name: string
    price: number
    full_name: string
    description: string
    brand_id: string
    category_id: string
    wholesale_price: number
    purchase_price: number
    currency: string
    tax_rate: number
    pricing_tiers: any[]
    unit_of_sale: string
    pack_size: number
    case_size: number
    pallet_size: number
    barcode: string
    barcode_type: string
    attributes: Record<string, any>
    weight: number
    weight_unit: string
    dimensions: Record<string, any>
    packaging: string
    storage: string
    shelf_life_days: number
    halal: boolean
    allow_backorder: boolean
    is_active: boolean
    tags: any[]
    certifications: any[]
    ingredients: any[]
    nutrition_facts: Record<string, any>
    warranty_months: number
    returnable: boolean
    id: string // uuid
    created_at: string // ISO date
    updated_at: string // ISO date
    store: Record<string, any>
    category: Record<string, any>
    brand: Record<string, any>
    images: any[]
    warehouse_availability: any[]
}

export interface CreateProductRequest {
    sku: string
    name: string
    full_name: string
    description: string
    brand_id: string // uuid
    category_id: string // uuid
    price: number
    wholesale_price: number
    purchase_price: number
    currency: string
    tax_rate: number
    pricing_tiers: any[]
    unit_of_sale: string
    pack_size: number
    case_size: number
    pallet_size: number
    barcode: string
    barcode_type: string
    attributes: Record<string, any>
    weight: number
    weight_unit: string
    dimensions: Record<string, any>
    packaging: string
    storage: string
    shelf_life_days: number
    halal: boolean
    allow_backorder: boolean
    is_active: boolean
    tags: any[]
    certifications: any[]
    ingredients: any[]
    nutrition_facts: Record<string, any>
    warranty_months: number
    returnable: boolean
}

export type UpdateProductRequest = Partial<CreateProductRequest>

    export type ProductResponse = ApiResponse<ProductData>
    export type ProductListResponse = ApiResponse<ProductData[]>
