import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type { BrandData, CreateBrandRequest, UpdateBrandRequest } from './model/types'

// api
export const brandsApi = createCrudApi<BrandData, CreateBrandRequest, UpdateBrandRequest>(
catalogClient,
API_ROUTES.BRANDS.ROOT,
)

// hooks
export const brandsQueries = createCrudHooks<BrandData, CreateBrandRequest, UpdateBrandRequest>(
'brand',
brandsApi,
)