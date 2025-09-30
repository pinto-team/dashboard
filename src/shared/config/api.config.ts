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

function readEnv(key: string): string {
    const env = import.meta.env as Record<string, string | undefined>
    return env[key] ?? ''
}

const DEFAULT_BASE_URL = normalizeBaseUrl(
    readEnv('VITE_API_URL') || 'http://localhost:3000',
)

function buildFeatureConfig(envKey: string, fallback: string = DEFAULT_BASE_URL) {
    return {
        BASE_URL: normalizeBaseUrl(readEnv(envKey) || fallback),
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
    // Main API URL (fallback for backward compatibility)
    BASE_URL: DEFAULT_BASE_URL,

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
