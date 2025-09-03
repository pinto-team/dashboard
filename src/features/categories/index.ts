import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { createCrudApi } from '@/shared/api/crudFactory'
import { createCrudHooks } from '@/shared/api/useCrudQueries'
import type { CategoryData, CreateCategoryRequest, UpdateCategoryRequest } from './model/types'

// api
export const categoriesApi = createCrudApi<CategoryData, CreateCategoryRequest, UpdateCategoryRequest>(catalogClient, API_ROUTES.CATEGORIES.ROOT)

// hooks
export const categoriesQueries = createCrudHooks<CategoryData, CreateCategoryRequest, UpdateCategoryRequest>('category', categoriesApi)