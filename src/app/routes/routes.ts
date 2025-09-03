export const ROUTES = {
    ROOT: '/',

    LOGIN: '/login',

    DASHBOARD: '/dashboard',

    // Category
    Brand: {
        LIST: '/categories',
        NEW: '/categories/new',
        EDIT: (id = ':id') => `/categories/${id}`,
    },

    // Category
    CATEGORY: {
        LIST: '/categories',
        NEW: '/categories/new',
        EDIT: (id = ':id') => `/categories/${id}`,
    },
} as const
