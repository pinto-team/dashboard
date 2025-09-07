// src/app/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom'

import AppRoot from '@/app/App'
import { ROUTES } from '@/app/routes/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import NotFound from './NotFound'
import ProtectedRoute from './ProtectedRoute'
import ListBrandsPage from '@/features/brands/pages/ListBrands'
import AddBrandPage from '@/features/brands/pages/AddBrand'
import EditBrandPage from '@/features/brands/pages/EditBrand'

import DetailBrandPage from '@/features/brands/pages/DetailBrand'
import ListCategoriesPage from '@/features/categories/pages/ListCategories'
import AddCategoryPage from '@/features/categories/pages/AddCategory'
import EditCategoryPage from '@/features/categories/pages/EditCategory'
import DetailCategoryPage from '@/features/categories/pages/DetailCategory'

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },

                    { path: ROUTES.BRAND.LIST, element: <ListBrandsPage /> },
                    { path: ROUTES.BRAND.NEW, element: <AddBrandPage /> },
                    { path: ROUTES.BRAND.DETAIL(), element: <DetailBrandPage /> },
                    { path: ROUTES.BRAND.EDIT(), element: <EditBrandPage /> },

                    { path: ROUTES.CATEGORY.LIST, element: <ListCategoriesPage /> },
                    { path: ROUTES.CATEGORY.NEW, element: <AddCategoryPage /> },
                    { path: ROUTES.CATEGORY.DETAIL(), element: <DetailCategoryPage /> },
                    { path: ROUTES.CATEGORY.EDIT(), element: <EditCategoryPage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
