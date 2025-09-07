import type { ApiResponse } from "@/shared/api/types";

//
// ==========================
// Server-side types (API)
// ==========================
export interface CategoryData {
    id: string;
    name: string;
    description?: string | null;
    image_url?: string | null;
    image_id?: string | null;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryRequest {
    name: string;
    description?: string | null;
    parent_id?: string | null;
    image_id?: string | null;
    image_url?: string | null;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export type CategoryResponse = ApiResponse<CategoryData>;
export type CategoryListResponse = ApiResponse<CategoryData[]>;

//
// ==========================
// Client-side type (for UI / Tree)
// ==========================
export interface Category {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    imageId?: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    children?: Category[];
    sort?: number | null;
}

//
// ==========================
// Mappers
// ==========================
export const mapFromServer = (s: CategoryData): Category => ({
    id: s.id,
    name: s.name,
    description: s.description ?? null,
    imageUrl: s.image_url ?? null,
    imageId: s.image_id ?? null,
    parentId: s.parent_id ?? null,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    children: [],
});

export const mapToCreate = (c: {
    name: string;
    description?: string | null;
    parentId?: string | null;
    imageId?: string | null;
    imageUrl?: string | null;
}): CreateCategoryRequest => ({
    name: c.name,
    description: c.description ?? undefined,
    parent_id: c.parentId ?? undefined,
    image_id: c.imageId ?? undefined,
    image_url: c.imageUrl ?? undefined,
});

export const mapToUpdate = (c: {
    name?: string;
    description?: string | null;
    parentId?: string | null;
    imageId?: string | null;
    imageUrl?: string | null;
}): UpdateCategoryRequest => ({
    ...(c.name !== undefined ? { name: c.name } : {}),
    ...(c.description !== undefined ? { description: c.description } : {}),
    ...(c.parentId !== undefined ? { parent_id: c.parentId } : {}),
    ...(c.imageId !== undefined ? { image_id: c.imageId } : {}),
    ...(c.imageUrl !== undefined ? { image_url: c.imageUrl } : {}),
});