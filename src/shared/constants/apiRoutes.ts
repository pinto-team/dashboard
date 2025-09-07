import { API_CONFIG } from '@/shared/config/api.config'

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH: '/auth/refresh',
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
