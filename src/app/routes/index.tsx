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
import EditCategoryPage from '@/features/categories/pages/EditCategory'
import ListProductsPage from '@/features/products/pages/ListProducts'
import AddProductPage from '@/features/products/pages/AddProduct'
import DetailProductPage from '@/features/products/pages/DetailProduct'
import EditProductPage from '@/features/products/pages/EditProduct'

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
                    { path: ROUTES.CATEGORY.EDIT(), element: <EditCategoryPage /> },

                    { path: ROUTES.PRODUCT.LIST, element: <ListProductsPage /> },
                    { path: ROUTES.PRODUCT.NEW, element: <AddProductPage /> },
                    { path: ROUTES.PRODUCT.DETAIL(), element: <DetailProductPage /> },
                    { path: ROUTES.PRODUCT.EDIT(), element: <EditProductPage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
