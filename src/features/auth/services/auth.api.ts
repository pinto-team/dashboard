// features/auth/services/auth.api.ts
import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { handleAsyncError } from '@/shared/lib/errors'
import { defaultLogger } from '@/shared/lib/logger'
import { buildAuthRequestContext, buildRefreshRequestPayload } from '../utils/context'
import { AuthLoginResult, AuthUser } from '../types'

function getLogger(action: string, context: Record<string, unknown> = {}) {
    return defaultLogger.withContext({ component: 'auth.api', action, ...context })
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

type RawRefreshPayload = {
    access_token?: unknown
    refresh_token?: unknown
    id_token?: unknown
    expires_in?: unknown
    audience?: unknown
    profile?: unknown
}

function normalizeString(value: unknown, fallback = ''): string {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return fallback
}

function mapProfileToUser(profile: Record<string, unknown>, fallbackId = ''): AuthUser {
    return {
        id: normalizeString(profile.id, fallbackId),
        username:
            normalizeString(
                profile.username,
                normalizeString(profile.email, fallbackId),
            ) || fallbackId,
        email: normalizeString(profile.email, ''),
        firstName: normalizeString(profile.first_name, ''),
        lastName: normalizeString(profile.last_name, ''),
        phone: normalizeString(profile.phone, '') || undefined,
        avatar: normalizeString(profile.avatar, '') || undefined,
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
                context: buildAuthRequestContext(),
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

                const user = mapProfileToUser(normalizedProfile, username)

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
            .post(API_ROUTES.AUTH.REFRESH, buildRefreshRequestPayload(refreshToken))
            .then(({ data: response }) => {
                logger.info('Token refresh successful')
                const payload = (response?.data ?? response ?? {}) as RawRefreshPayload
                const accessToken = normalizeString(payload.access_token, '')
                const newRefreshToken = normalizeString(payload.refresh_token, '')

                if (!accessToken || !newRefreshToken) {
                    throw new Error('Invalid refresh response: missing tokens')
                }

                const normalizedProfile = (payload.profile ?? {}) as Record<string, unknown>
                const user = Object.keys(normalizedProfile).length
                    ? mapProfileToUser(normalizedProfile, '')
                    : null

                return {
                    accessToken,
                    refreshToken: newRefreshToken,
                    user,
                }
            }),
        'Token refresh failed',
    )
}

export async function apiLogout() {
    const logger = getLogger('logout')

    logger.info('Attempting logout')

    return handleAsyncError(
        authClient.delete(API_ROUTES.SESSIONS.CURRENT).then(({ data }) => {
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
