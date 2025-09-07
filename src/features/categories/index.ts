import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type {
    CategoryData,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from './model/types'

// API
export const categoriesApi = createCrudApi<CategoryData, CreateCategoryRequest, UpdateCategoryRequest>(
    catalogClient,
    API_ROUTES.CATEGORIES.ROOT,
)

// Hooks (کلید کش یکتا و جمع: 'categories')
export const categoriesQueries = createCrudHooks<CategoryData, CreateCategoryRequest, UpdateCategoryRequest>(
    'categories',
    categoriesApi,
)

/**
 * نکته:
 * - برای لیست، پارام‌های سرور را هنگام استفاده پاس بده:
 *   categoriesQueries.useList({ parent_id: null, page: 1, limit: 50 })
 * - برای جابه‌جایی/انتقال، از useUpdate با payload شامل parent_id و/یا order استفاده کن.
 */
export * from './model/types'
