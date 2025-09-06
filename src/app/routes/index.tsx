// src/app/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom'

import AppRoot from '@/app/App'
import { ROUTES } from '@/app/routes/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import NotFound from './NotFound'
import ProtectedRoute from './ProtectedRoute'
import BrandsPage from '@/features/brands/pages/ListBrands'
import AddBrandPage from '@/features/brands/pages/AddBrand/AddBrandPage.tsx'
import EditBrandPage from '@/features/brands/pages/EditBrand'

import DetailBrandPage from '@/features/brands/pages/DetailBrand/DetailBrandPage'

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

                    { path: ROUTES.BRAND.LIST, element: <BrandsPage /> },
                    { path: ROUTES.BRAND.NEW, element: <AddBrandPage /> },
                    { path: ROUTES.BRAND.DETAIL(), element: <DetailBrandPage /> },
                    { path: ROUTES.BRAND.EDIT(), element: <EditBrandPage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
