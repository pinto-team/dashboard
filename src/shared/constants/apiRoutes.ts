import { API_CONFIG, normalizeBaseUrl } from '@/shared/config/api.config'

type FeatureKey = 'AUTH' | 'CATALOG'

function joinSegments(...segments: (string | number)[]): string {
    const cleaned = segments
        .map((segment) => String(segment).trim())
        .filter(Boolean)
        .map((segment) => segment.replace(/^\/+|\/+$/g, ''))

    if (cleaned.length === 0) {
        return '/'
    }

    return `/${cleaned.join('/')}`
}

const API_V1 = joinSegments('api', 'v1')
const ADMIN_AUTH = joinSegments(API_V1, 'admin', 'auth')
const FILES_ROOT = joinSegments('files')
const BRANDS_ROOT = joinSegments(API_V1, 'brands')
const CATEGORIES_ROOT = joinSegments(API_V1, 'categories')
const PRODUCTS_ROOT = joinSegments('products')
const SESSIONS_ROOT = joinSegments(API_V1, 'sessions')

export const API_ROUTES = {
    AUTH: {
        LOGIN: joinSegments(ADMIN_AUTH, 'login'),
        REFRESH: joinSegments(API_V1, 'auth', 'refresh'),
    },

    FILES: {
        UPLOAD: joinSegments(FILES_ROOT, 'upload'),
        DELETE: (id: string | number) => joinSegments(FILES_ROOT, id),
        GET: (id: string | number) => joinSegments(FILES_ROOT, id),
        THUMBNAIL: (id: string | number) => joinSegments(FILES_ROOT, id, 'thumbnail'),
    },
    BRANDS: {
        ROOT: BRANDS_ROOT,
    },
    CATEGORIES: {
        ROOT: CATEGORIES_ROOT,
        BY_ID: (id: string | number) => joinSegments(CATEGORIES_ROOT, id),
        BY_SLUG: (slug: string) => joinSegments(CATEGORIES_ROOT, 'slug', slug),
    },
    PRODUCTS: {
        ROOT: PRODUCTS_ROOT,
    },
    SESSIONS: {
        CURRENT: joinSegments(SESSIONS_ROOT, 'current'),
        ME_ALL: joinSegments(SESSIONS_ROOT, 'me', 'all'),
        ME_OTHERS: joinSegments(SESSIONS_ROOT, 'me', 'others'),
        BY_ID: (sessionId: string) => joinSegments(SESSIONS_ROOT, 'me', sessionId),
    },
} as const

export type ApiRoute = typeof API_ROUTES

type BuildApiUrlOptions = {
    baseUrl?: string
    feature?: FeatureKey
}

function normalizeRoute(route: string): string {
    if (!route) {
        return '/'
    }
    return route.startsWith('/') ? route : `/${route}`
}

function resolveBaseUrl(feature?: FeatureKey, override?: string): string {
    if (override) {
        return normalizeBaseUrl(override)
    }

    if (!feature) {
        return API_CONFIG.BASE_URL
    }

    return API_CONFIG[feature].BASE_URL
}

export function buildApiUrl(route: string, baseUrl?: string): string
export function buildApiUrl(route: string, options?: BuildApiUrlOptions): string
export function buildApiUrl(
    route: string,
    arg?: string | BuildApiUrlOptions,
): string {
    const options: BuildApiUrlOptions =
        typeof arg === 'string' ? { baseUrl: arg } : arg ?? {}

    const normalizedRoute = normalizeRoute(route)
    const base = resolveBaseUrl(options.feature, options.baseUrl)

    return `${base}${normalizedRoute}`
}

export function buildFeatureUrl(
    feature: FeatureKey,
    route: string,
    baseUrl?: string,
): string {
    return buildApiUrl(route, { feature, baseUrl })
}
