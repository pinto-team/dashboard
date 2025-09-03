import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type { WarehouseData, CreateWarehouseRequest, UpdateWarehouseRequest } from './model/types'

// api
export const warehousesApi = createCrudApi<WarehouseData, CreateWarehouseRequest, UpdateWarehouseRequest>(
catalogClient,
API_ROUTES.WAREHOUSES.ROOT,
)

// hooks
export const warehousesQueries = createCrudHooks<WarehouseData, CreateWarehouseRequest, UpdateWarehouseRequest>(
'warehouse',
warehousesApi,
)