export interface PackagingBarcode {
    level: string
    barcode: string
    barcode_type: string
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

export interface ProductData {
    id: string
    category_id: string
    brand_id?: string | null
    sku?: string
    name: string
    full_name?: string
    description?: string
    price: number
    barcode?: string
    barcode_type?: string
    packaging_barcodes?: PackagingBarcode[]
    unit_of_sale?: string
    pack_size?: number
    case_size?: number
    pallet_size?: number
    attributes?: Record<string, string>
    weight?: number
    weight_unit?: string
    dimensions?: Dimensions
    packaging?: string
    storage?: string
    shelf_life_days?: number
    ingredients?: string[]
    nutrition_facts?: NutritionFacts
    dietary?: DietaryInfo
    allergens?: string[]
    is_active?: boolean
    tags?: string[]
    primary_image_id?: string | null
    image_ids?: string[]
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
}

export interface CreateProductRequest {
    sku?: string
    name: string
    price: number
    category_id: string
    brand_id?: string
    description?: string
    primary_image_id?: string
}

export type UpdateProductRequest = Partial<CreateProductRequest>
