// models.ts

export interface PackagingBarcode {
    level: string
    barcode: string
    barcode_type?: string
}

export interface Dimensions {
    length: number
    width: number
    height: number
    unit: string
}

export interface NutritionFacts {
    calories?: number
    fat?: number
    protein?: number
    carbohydrates?: number
    [key: string]: number | undefined
}

export interface DietaryInfo {
    halal?: boolean
    kosher?: boolean
    vegetarian?: boolean
    vegan?: boolean
    gluten_free?: boolean
    [key: string]: boolean | undefined
}

export interface Attribute {
    key: string
    value: string
}

export interface Image {
    id: string
    url?: string
    alt_text?: string
    filename?: string
    content_type?: string
    size?: number
    created_at?: string
    updated_at?: string
}

export interface Tag {
    id: string
    name: string
    created_at?: string
    updated_at?: string
}

export interface PriceTier {
    level: string          // each | pack | case | pallet
    price: number
    currency: string
    min_qty?: number
}

export interface ProductData {
    id: string
    category_id: string
    brand_id?: string | null
    sku?: string
    name: string
    full_name?: string
    description?: string

    // Pricing
    price: number
    currency?: string
    discount_price?: number | null
    price_tiers?: PriceTier[]

    // Identification
    barcode?: string
    barcode_type?: string
    packaging_barcodes?: PackagingBarcode[]

    // Packaging / UOM
    unit_of_sale?: string
    pack_size?: number
    case_size?: number
    pallet_size?: number

    // Attributes
    attributes?: Record<string, string> | Attribute[]
    weight?: number
    weight_unit?: string
    dimensions?: Dimensions

    // Handling & shelf life
    packaging?: string
    storage?: string
    shelf_life_days?: number

    // Food specifics
    ingredients?: string[]
    nutrition_facts?: NutritionFacts
    dietary?: DietaryInfo
    allergens?: string[]

    // Catalog flags
    is_active?: boolean
    tags?: string[] | Tag[]

    // Media
    primary_image_id?: string | null
    image_ids?: string[]
    images?: Image[]

    // Metadata
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
}

export interface CreateProductRequest {
    sku?: string
    name: string
    full_name?: string
    description?: string
    category_id: string
    brand_id?: string

    // Pricing
    price: number
    currency?: string
    discount_price?: number
    price_tiers?: PriceTier[]

    // Optional
    barcode?: string
    barcode_type?: string
    weight?: number
    weight_unit?: string
    packaging?: string
    storage?: string
    shelf_life_days?: number
    is_active?: boolean
    primary_image_id?: string
    image_ids?: string[]
    attributes?: Attribute[]
}

export type UpdateProductRequest = Partial<CreateProductRequest>
