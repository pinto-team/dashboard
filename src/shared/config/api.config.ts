// shared/config/api.config.ts
/**
 * Central API configuration for all services.
 *
 * Environment variables:
 * - VITE_AUTH_API_URL: auth service base url
 * - VITE_CATALOG_API_URL: catalog service base url
 * - VITE_FILES_API_URL: files service base url
 * - VITE_BRANDS_API_URL: brands service base url
 * - VITE_CATEGORIES_API_URL: categories service base url
 * - VITE_PRODUCTS_API_URL: products service base url
 * - VITE_SESSIONS_API_URL: sessions service base url
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

function readEnv(key: string): string {
    const env = import.meta.env as Record<string, string | undefined>
    return env[key] ?? ''
}

function buildFeatureConfig(envKey: string) {
    return {
        BASE_URL: normalizeBaseUrl(readEnv(envKey)),
    }
}

const FEATURE_CONFIG = {
    AUTH: buildFeatureConfig('VITE_AUTH_API_URL'),
    CATALOG: buildFeatureConfig('VITE_CATALOG_API_URL'),
    FILES: buildFeatureConfig('VITE_FILES_API_URL'),
    BRANDS: buildFeatureConfig('VITE_BRANDS_API_URL'),
    CATEGORIES: buildFeatureConfig('VITE_CATEGORIES_API_URL'),
    PRODUCTS: buildFeatureConfig('VITE_PRODUCTS_API_URL'),
    SESSIONS: buildFeatureConfig('VITE_SESSIONS_API_URL'),
} as const

export type ApiFeature = keyof typeof FEATURE_CONFIG

export const API_CONFIG = {
    // Feature-specific API URLs
    ...FEATURE_CONFIG,

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
