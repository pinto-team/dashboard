export const ROUTES = {
    ROOT: '/',

    LOGIN: '/login',

    DASHBOARD: '/dashboard',

    // Brand
    BRAND: {
        LIST: '/brands',
        NEW: '/brands/new',
        DETAIL: (id = ':id') => `/brands/${id}`,
        EDIT: (id = ':id') => `/brands/${id}/edit`,
    },
    // Category
    CATEGORY: {
        LIST: '/categories',
        NEW: '/categories/new',
        DETAIL: (id = ':id') => `/categories/${id}`,
        EDIT: (id = ':id') => `/categories/${id}/edit`,
    },
} as const
