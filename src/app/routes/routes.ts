export const ROUTES = {
    ROOT: '/',

    LOGIN: '/login',

    DASHBOARD: '/dashboard',

    // Category
    BRAND: {
        LIST: '/brand',
        NEW: '/brand/new',
        EDIT: (id = ':id') => `/brand/${id}`,
    },

    // Category
    CATEGORY: {
        LIST: '/categories',
        NEW: '/categories/new',
        EDIT: (id = ':id') => `/categories/${id}`,
    },
} as const
