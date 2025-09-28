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
    session_id?: unknown
    sessionId?: unknown
    session?: unknown
}

type RawRefreshPayload = {
    access_token?: unknown
    refresh_token?: unknown
    id_token?: unknown
    expires_in?: unknown
    audience?: unknown
    profile?: unknown
    session_id?: unknown
    sessionId?: unknown
    session?: unknown
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

function extractSessionId(payload: Record<string, unknown>): string | null {
    const direct = normalizeString(payload.session_id, '')
    if (direct) {
        return direct
    }

    const camel = normalizeString(payload.sessionId, '')
    if (camel) {
        return camel
    }

    const nested = payload.session
    if (nested && typeof nested === 'object') {
        const record = nested as Record<string, unknown>
        const nestedDirect = normalizeString(record.session_id, '')
        if (nestedDirect) {
            return nestedDirect
        }

        const nestedCamel = normalizeString(record.sessionId, '')
        if (nestedCamel) {
            return nestedCamel
        }

        const nestedId = normalizeString(record.id, '')
        if (nestedId) {
            return nestedId
        }
    }

    return null
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
                const sessionId = extractSessionId(payload as Record<string, unknown>)

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
                    sessionId,
                }
            }),
        'Login failed',
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
                const sessionId = extractSessionId(payload as Record<string, unknown>)

                return {
                    accessToken,
                    refreshToken: newRefreshToken,
                    user,
                    sessionId,
                }
            }),
        'Token refresh failed',
    )
}

export async function apiLogout(sessionId: string) {
    const logger = getLogger('logout')

    logger.info('Attempting logout', { sessionId })

    return handleAsyncError(
        authClient.delete(API_ROUTES.SESSIONS.BY_ID(sessionId)).then(({ data }) => {
            logger.info('Logout successful')
            return data
        }),
        'Logout failed',
    )
}
