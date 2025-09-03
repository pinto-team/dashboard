import { createBrowserRouter } from 'react-router-dom'

import AppRoot from '@/app/App'
import { ROUTES } from '@/app/routes/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import AddBrandPage from '@/features/brand/pages/AddBrandPage'
// Brands
import
    BrandsPage from '@/features/brand/pages/BrandsPage'
import EditBrandPage from '@/features/brand/pages/EditBrandPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'

import NotFound from './NotFound'
import ProtectedRoute from './ProtectedRoute'
import CategoriesPage from '@/features/categories/pages/CategoriesPage.tsx'
import AddCategoryPage from '@/features/categories/pages/AddCategoryPage.tsx'
import EditCategoryPage from '@/features/categories/pages/EditCategoryPage.tsx'

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> }, // default
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> }, // /dashboard

                    //Brands
                    { path: ROUTES.Brand.LIST, element: <BrandsPage /> }, // /brand
                    { path: ROUTES.Brand.NEW, element: <AddBrandPage /> }, // /brand/new
                    { path: ROUTES.Brand.EDIT(), element: <EditBrandPage /> }, // /brand/:id

                    // Categories
                    { path: ROUTES.CATEGORY.LIST, element: <CategoriesPage /> }, // /category
                    { path: ROUTES.CATEGORY.NEW, element: <AddCategoryPage /> }, // /category/new
                    { path: ROUTES.CATEGORY.EDIT(), element: <EditCategoryPage /> }, // /category/:id
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
