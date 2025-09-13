// features/auth/services/auth.api.ts
import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { handleAsyncError } from '@/shared/lib/errors'
import { defaultLogger } from '@/shared/lib/logger'
import { AuthUser } from '../types'

function getLogger(action: string, context: Record<string, unknown> = {}) {
    return defaultLogger.withContext({ component: 'auth.api', action, ...context })
}

export async function apiLogin(username: string, password: string) {
    const logger = getLogger('login', { username })

    logger.info('Attempting login')

    const context = {
        platform: 'web',
        browser_name: navigator.userAgent,
        browser_system_name: navigator.platform,
        browser_system_version: navigator.userAgent,
        app_version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    }

    return handleAsyncError(
        authClient
            .post(API_ROUTES.AUTH.LOGIN, { username, password, context })
            .then(({ data: response }) => {
                logger.info('Login successful')
                const { access_token, refresh_token, profile } = response.data
                const user: AuthUser = {
                    id: profile.id,
                    username,
                    email: profile.email,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    phone: profile.phone,
                    avatar: profile.avatar,
                }
                return {
                    accessToken: access_token,
                    refreshToken: refresh_token,
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
