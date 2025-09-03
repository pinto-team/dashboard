import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type { ProductData, CreateProductRequest, UpdateProductRequest } from './model/types'

// api
export const productsApi = createCrudApi<ProductData, CreateProductRequest, UpdateProductRequest>(
catalogClient,
API_ROUTES.PRODUCTS.ROOT,
)

// hooks
export const productsQueries = createCrudHooks<ProductData, CreateProductRequest, UpdateProductRequest>(
'product',
productsApi,
)