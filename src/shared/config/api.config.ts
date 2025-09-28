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

function normalizeBaseUrl(url: string): string {
    if (!url) {
        return ''
    }
    return url.replace(/\/+$/, '')
}

const DEFAULT_BASE_URL = normalizeBaseUrl(
    import.meta.env.VITE_API_URL || 'http://localhost:3000',
)
const DEFAULT_AUTH_URL = normalizeBaseUrl(
    import.meta.env.VITE_AUTH_API_URL || DEFAULT_BASE_URL,
)
const DEFAULT_CATALOG_URL = normalizeBaseUrl(
    import.meta.env.VITE_CATALOG_API_URL || DEFAULT_BASE_URL,
)

export const API_CONFIG = {
    // Main API URL (fallback for backward compatibility)
    BASE_URL: DEFAULT_BASE_URL,

    // Feature-specific API URLs
    AUTH: {
        BASE_URL: DEFAULT_AUTH_URL,
    },

    CATALOG: {
        BASE_URL: DEFAULT_CATALOG_URL,
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

export { normalizeBaseUrl }
