import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type { BrandData, CreateBrandRequest, UpdateBrandRequest } from './model/types'

// api — امضای جدید: (basePath: string, opts?)
export const brandsApi = createCrudApi<BrandData, CreateBrandRequest, UpdateBrandRequest>(
    API_ROUTES.BRANDS.ROOT,
    { feature: 'brands' } // اختیاری
)

// hooks
export const brandsQueries = createCrudHooks<BrandData, CreateBrandRequest, UpdateBrandRequest>(
    'brand',
    brandsApi,
)
