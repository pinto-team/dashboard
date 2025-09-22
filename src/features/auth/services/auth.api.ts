// features/auth/services/auth.api.ts
import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { handleAsyncError } from '@/shared/lib/errors'
import { defaultLogger } from '@/shared/lib/logger'
import { AuthLoginResult, AuthUser } from '../types'

function getLogger(action: string, context: Record<string, unknown> = {}) {
    return defaultLogger.withContext({ component: 'auth.api', action, ...context })
}

const DEVICE_ID_STORAGE_KEY = 'auth.deviceId'

type NavigatorWithUAData = Navigator & {
    userAgentData?: {
        brands?: Array<{ brand: string; version?: string }>
        platform?: string
        platformVersion?: string
    }
}

type RawLoginPayload = {
    access_token?: unknown
    refresh_token?: unknown
    id_token?: unknown
    expires_in?: unknown
    token_type?: unknown
    audience?: unknown
    profile?: unknown
}

function normalizeString(value: unknown, fallback = ''): string {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return fallback
}

function ensureDeviceId(): string {
    if (typeof window === 'undefined') return 'web-unknown-device'

    try {
        const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
        if (existing) {
            return existing
        }

        const newId =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `device-${Math.random().toString(36).slice(2)}-${Date.now()}`

        localStorage.setItem(DEVICE_ID_STORAGE_KEY, newId)
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

function getLoginContext() {
    const nav =
        typeof navigator === 'undefined' ? undefined : (navigator as NavigatorWithUAData)
    const uaData = nav?.userAgentData
    const userAgent = normalizeString(nav?.userAgent, '')

    const platform = normalizeString(uaData?.platform || nav?.platform, 'web')
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

export async function apiLogin(username: string, password: string): Promise<AuthLoginResult> {
    const logger = getLogger('login', { username })

    logger.info('Attempting login')

    return handleAsyncError(
        authClient
            .post(API_ROUTES.AUTH.LOGIN, {
                username,
                password,
                context: getLoginContext(),
            })
            .then(({ data: response }) => {
                logger.info('Login successful')
                const payload = (response?.data ?? response ?? {}) as RawLoginPayload
                const {
                    access_token,
                    refresh_token,
                    id_token = null,
                    expires_in = 0,
                    token_type = 'Bearer',
                    audience = [],
                    profile = {},
                } = payload

                const normalizedProfile = (profile ?? {}) as Record<string, unknown>

                const accessToken = normalizeString(access_token, '')
                const refreshToken = normalizeString(refresh_token, '')
                if (!accessToken || !refreshToken) {
                    throw new Error('Invalid login response: missing tokens')
                }

                const user: AuthUser = {
                    id: normalizeString(normalizedProfile.id, username),
                    username: normalizeString(normalizedProfile.username, username),
                    email: normalizeString(normalizedProfile.email, ''),
                    firstName: normalizeString(normalizedProfile.first_name, ''),
                    lastName: normalizeString(normalizedProfile.last_name, ''),
                    phone: normalizeString(normalizedProfile.phone, '') || undefined,
                    avatar: normalizeString(normalizedProfile.avatar, '') || undefined,
                }

                return {
                    accessToken,
                    refreshToken,
                    idToken: normalizeString(id_token, '') || null,
                    expiresIn: Number(expires_in) || 0,
                    tokenType: normalizeString(token_type, 'Bearer'),
                    audience: Array.isArray(audience)
                        ? audience
                              .map((entry) => normalizeString(entry, ''))
                              .filter((entry) => entry.length > 0)
                        : [],
                    user,
                }
            }),
        'Login failed',
    )
}

export async function apiMe(token: string) {
    const logger = getLogger('fetchUserInfo')

    logger.info('Fetching user info')

    return handleAsyncError(
        authClient
            .get(API_ROUTES.AUTH.ME, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(({ data: response }) => {
                logger.info('User info fetched successfully')
                const profile = response.data?.profile || response.data
                const user: AuthUser = {
                    id: profile.id,
                    username: profile.username || profile.email,
                    email: profile.email,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    phone: profile.phone,
                    avatar: profile.avatar,
                }
                return user
            }),
        'Failed to fetch user info',
    )
}

export async function apiRefresh(refreshToken: string) {
    const logger = getLogger('refreshToken')

    logger.info('Attempting token refresh')

    return handleAsyncError(
        authClient
            .post(API_ROUTES.AUTH.REFRESH, { refresh_token: refreshToken })
            .then(({ data: response }) => {
                logger.info('Token refresh successful')
                const { access_token, refresh_token } = response.data
                return {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                }
            }),
        'Token refresh failed',
    )
}

export async function apiLogout() {
    const logger = getLogger('logout')

    logger.info('Attempting logout')

    return handleAsyncError(
        authClient.delete(API_ROUTES.AUTH.LOGOUT).then(({ data }) => {
            logger.info('Logout successful')
            return data
        }),
        'Logout failed',
    )
}

export async function apiRegister(userData: {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
}) {
    const logger = getLogger('register', { email: userData.email })

    logger.info('Attempting user registration')

    return handleAsyncError(
        authClient.post(API_ROUTES.AUTH.REGISTER, userData).then(({ data }) => {
            logger.info('Registration successful')
            return data
        }),
        'Registration failed',
    )
}

export async function apiForgotPassword(email: string) {
    const logger = getLogger('forgotPassword', { email })

    logger.info('Attempting password reset request')

    return handleAsyncError(
        authClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email }).then(({ data }) => {
            logger.info('Password reset request successful')
            return data
        }),
        'Password reset request failed',
    )
}
