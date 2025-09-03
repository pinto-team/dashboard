import type { ApiResponse } from '@/shared/api/types'

export interface WarehouseData {
    name: string
    location: string
    capacity: number
    manager_id: string // uuid
    id: string // uuid
    created_at: string // ISO date
    updated_at: string // ISO date
}

export interface CreateWarehouseRequest {
    name: string
    location: string
    capacity: number
    manager_id: string // uuid
}

export type UpdateWarehouseRequest = Partial<CreateWarehouseRequest>

    export type WarehouseResponse = ApiResponse<WarehouseData>
    export type WarehouseListResponse = ApiResponse<WarehouseData[]>
