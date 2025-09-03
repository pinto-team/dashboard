// shared/config/api.config.ts
/**
 * Central API configuration for all services.
 *
 * Environment variables:
 * - VITE_API_URL: default base url for monolith/back-compat
 * - VITE_AUTH_API_URL: auth service base url
 * - VITE_CATALOG_API_URL: catalog service base url
 * - VITE_ENABLE_MSW: enable Mock Service Worker for local development
 *
 * Development flags only affect logging and do not change behavior.
 */

export const API_CONFIG = {
    // Main API URL (fallback for backward compatibility)
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

    // Feature-specific API URLs
    AUTH: {
        BASE_URL:
            import.meta.env.VITE_AUTH_API_URL ||
            import.meta.env.VITE_API_URL ||
            'http://localhost:3000',
    },

    CATALOG: {
        BASE_URL:
            import.meta.env.VITE_CATALOG_API_URL ||
            import.meta.env.VITE_API_URL ||
            'http://localhost:3000',
    },

    // MSW configuration
    MSW: {
        ENABLED: import.meta.env.VITE_ENABLE_MSW === 'true',
    },

    // Development settings
    DEV: {
        LOG_REQUESTS: import.meta.env.NODE_ENV === 'development',
        LOG_RESPONSES: import.meta.env.NODE_ENV === 'development',
    },
} as const

export type ApiConfig = typeof API_CONFIG
