// features/auth/utils/context.ts
// Utilities for constructing auth-related request payloads and metadata.

const DEVICE_ID_STORAGE_KEY = 'auth.deviceId'

function normalizeString(value: unknown, fallback = ''): string {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return fallback
}

type NavigatorWithUAData = Navigator & {
    userAgentData?: {
        brands?: Array<{ brand: string; version?: string }>
        platform?: string
        platformVersion?: string
    }
}

function ensureDeviceId(): string {
    if (typeof window === 'undefined') return 'web-unknown-device'

    try {
        const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY)
        if (existing) {
            return existing
        }

        const newId =
            typeof window.crypto !== 'undefined' && 'randomUUID' in window.crypto
                ? window.crypto.randomUUID()
                : `device-${Math.random().toString(36).slice(2)}-${Date.now()}`

        window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, newId)
        return newId
    } catch {
        return 'web-unknown-device'
    }
}

function detectBrowserName(userAgent: string): string {
    if (!userAgent) return 'unknown'
    if (/Edg\//i.test(userAgent)) return 'Edge'
    if (/OPR\//i.test(userAgent) || /Opera/i.test(userAgent)) return 'Opera'
    if (/Chrome\//i.test(userAgent)) return 'Chrome'
    if (/Safari/i.test(userAgent) && /Version\//i.test(userAgent)) return 'Safari'
    if (/Firefox\//i.test(userAgent)) return 'Firefox'
    return 'unknown'
}

export function buildAuthRequestContext() {
    const nav = typeof navigator === 'undefined' ? undefined : (navigator as NavigatorWithUAData)
    const uaData = nav?.userAgentData
    const userAgent = normalizeString(nav?.userAgent, '')

    const platform = 'web'
    const platformVersion = normalizeString(
        uaData?.platformVersion || nav?.appVersion,
        userAgent || 'unknown',
    )

    const browserName = normalizeString(
        uaData?.brands?.[0]?.brand,
        detectBrowserName(userAgent),
    )

    return {
        device_id: ensureDeviceId(),
        platform,
        platform_version: platformVersion || 'unknown',
        browser_name: browserName || 'unknown',
        browser_system_name: normalizeString(nav?.platform, platform) || 'unknown',
        browser_system_version:
            normalizeString(nav?.appVersion, userAgent || 'unknown') || 'unknown',
        app_version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    }
}

export function getDefaultSystemRole(): string {
    return import.meta.env.VITE_AUTH_SYSTEM_ROLE || 'super_admin'
}

export function buildRefreshRequestPayload(refreshToken: string) {
    return {
        refresh_token: refreshToken,
        context: buildAuthRequestContext(),
        system_role: getDefaultSystemRole(),
    }
}

export type AuthRequestContext = ReturnType<typeof buildAuthRequestContext>
