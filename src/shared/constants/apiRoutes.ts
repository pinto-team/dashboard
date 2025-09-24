import { API_CONFIG } from '@/shared/config/api.config'

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/api/v1/admin/auth/login',
        LOGOUT: '/api/users/logout',
        ME: '/auth/me',
        REFRESH: '/api/v1/auth/refresh',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },

    FILES: {
        UPLOAD: '/files/upload',
        DELETE: (id: string | number) => `/files/${id}`,
        GET: (id: string | number) => `/files/${id}`,
        THUMBNAIL: (id: string | number) => `/files/${id}/thumbnail`,
    },
    BRANDS: {
        ROOT: '/brands',
    },
    CATEGORIES: {
        ROOT: '/categories',
        BY_ID: (id: string | number) => `/categories/${id}`,
        ORDER: (id: string | number) => `/categories/${id}/order`,
        REORDER: '/categories/reorder',
        REORDER_BY_ID: (id: string | number) => `/categories/${id}/reorder`,
    },
    PRODUCTS: {
        ROOT: '/products',
    },
    SESSIONS: {
        CURRENT: '/api/v1/sessions/current',
        ME_ALL: '/api/v1/sessions/me/all',
        ME_OTHERS: '/api/v1/sessions/me/others',
        BY_ID: (sessionId: string) => `/api/v1/sessions/${sessionId}`,
    },
} as const

export type ApiRoute = typeof API_ROUTES

// Helper function to build full URLs
export function buildApiUrl(route: string, baseUrl?: string): string {
    const base = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${base}${route}`
}

// Helper function to build feature-specific URLs
export function buildFeatureUrl(feature: keyof typeof API_CONFIG, route: string): string {
    const base = API_CONFIG[feature]?.BASE_URL || API_CONFIG.BASE_URL
    return `${base}${route}`
}
