export type UUID = string;

export interface CategoryData {
    id: UUID;
    name: string;
    description: string | null;
    parent_id: UUID | null;
    image_url: string | null;
    order: number; // موقعیت بین خواهر-برادرها (از 0 شروع)
    created_at: string; // ISO8601
    updated_at: string; // ISO8601
}

export interface CreateCategoryRequest {
    name: string;
    parent_id?: UUID | null;
    order?: number; // اختیاری؛ اگر ندی انتهای لیست می‌رود
    description?: string | null;
    image_url?: string | null;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string | null;
    image_url?: string | null;
    parent_id?: UUID | null; // برای جابه‌جایی والد
    order?: number;          // برای جابه‌جایی داخل همان والد یا جای جدید در والد جدید
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface ApiSuccessSingle<T> {
    data: T;
    meta?: { pagination?: PaginationMeta; [k: string]: any };
}

export interface ApiSuccessList<T> {
    data: T[];
    meta?: { pagination: PaginationMeta; [k: string]: any };
}

export interface ListCategoriesParams {
    parent_id?: UUID | null;
    page?: number;
    limit?: number;
    // اگر خواستی بعداً سرچ بر اساس name اضافه کنیم
    name?: string;
}
