export const ROUTES = {
ROOT: '/',

LOGIN: '/login',

DASHBOARD: '/dashboard',

    // Product
    PRODUCT: {
    LIST: '/products',
    NEW: '/products/new',
    EDIT: (id = ':id') => `/products/${id}`,
    },
    // Category
    CATEGORY: {
    LIST: '/categories',
    NEW: '/categories/new',
    EDIT: (id = ':id') => `/categories/${id}`,
    },
    // Brand
    BRAND: {
    LIST: '/brands',
    NEW: '/brands/new',
    EDIT: (id = ':id') => `/brands/${id}`,
    },
    // Warehouse
    WAREHOUSE: {
    LIST: '/warehouses',
    NEW: '/warehouses/new',
    EDIT: (id = ':id') => `/warehouses/${id}`,
    },
} as const
