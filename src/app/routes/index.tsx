// src/app/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom'

import AppRoot from '@/app/App'
import { ROUTES } from '@/app/routes/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import NotFound from './NotFound'
import ProtectedRoute from './ProtectedRoute'

import ProductsPage from '@/features/products/pages/ProductsPage'
import AddProductPage from '@/features/products/pages/AddProductPage'
import EditProductPage from '@/features/products/pages/EditProductPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'
import AddCategoryPage from '@/features/categories/pages/AddCategoryPage'
import EditCategoryPage from '@/features/categories/pages/EditCategoryPage'
import BrandsPage from '@/features/brands/pages/ListBrands'
import AddBrandPage from '@/features/brands/pages/AddBrand/AddBrandPage.tsx'
import EditBrandPage from '@/features/brands/pages/EditBrand/EditBrandPage.tsx'

// 👇 اضافه کنید
import DetailBrandPage from '@/features/brands/pages/DetailBrand/DetailBrandPage'
import WarehousesPage from '@/features/warehouses/pages/WarehousesPage.tsx'
import AddWarehousePage from '@/features/warehouses/pages/AddWarehousePage.tsx'
import EditWarehousePage from '@/features/warehouses/pages/EditWarehousePage.tsx'

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

                    { path: ROUTES.PRODUCT.LIST, element: <ProductsPage /> },
                    { path: ROUTES.PRODUCT.NEW, element: <AddProductPage /> },
                    { path: ROUTES.PRODUCT.EDIT(), element: <EditProductPage /> },

                    { path: ROUTES.CATEGORY.LIST, element: <CategoriesPage /> },
                    { path: ROUTES.CATEGORY.NEW, element: <AddCategoryPage /> },
                    { path: ROUTES.CATEGORY.EDIT(), element: <EditCategoryPage /> },

                    { path: ROUTES.BRAND.LIST, element: <BrandsPage /> },
                    { path: ROUTES.BRAND.NEW, element: <AddBrandPage /> },

                    // 👇 صفحه جزئیات (جدید)
                    { path: ROUTES.BRAND.DETAIL(), element: <DetailBrandPage /> },

                    // ادیت حالا روی /brands/:id/edit است (با همان کلید قبلی)
                    { path: ROUTES.BRAND.EDIT(), element: <EditBrandPage /> },

                    { path: ROUTES.WAREHOUSE.LIST, element: <WarehousesPage /> },
                    { path: ROUTES.WAREHOUSE.NEW, element: <AddWarehousePage /> },
                    { path: ROUTES.WAREHOUSE.EDIT(), element: <EditWarehousePage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
