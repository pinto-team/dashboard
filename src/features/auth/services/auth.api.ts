// features/auth/services/auth.api.ts
import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { handleAsyncError } from '@/shared/lib/errors'
import { defaultLogger } from '@/shared/lib/logger'

function getLogger(action: string, context: Record<string, unknown> = {}) {
    return defaultLogger.withContext({ component: 'auth.api', action, ...context })
}

export async function apiLogin(username: string, password: string) {
    const logger = getLogger('login', { username })

    logger.info('Attempting login')

    return handleAsyncError(
        authClient.post(API_ROUTES.AUTH.LOGIN, { username, password }).then(({ data }) => {
            logger.info('Login successful')
            return data
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
            .then(({ data }) => {
                logger.info('User info fetched successfully')
                return data
            }),
        'Failed to fetch user info',
    )
}

export async function apiRefresh(refreshToken: string) {
    const logger = getLogger('refreshToken')

    logger.info('Attempting token refresh')

    return handleAsyncError(
        authClient.post(API_ROUTES.AUTH.REFRESH, { refreshToken }).then(({ data }) => {
            logger.info('Token refresh successful')
            return data
        }),
        'Token refresh failed',
    )
}

export async function apiLogout() {
    const logger = getLogger('logout')

    logger.info('Attempting logout')

    return handleAsyncError(
        authClient.post(API_ROUTES.AUTH.LOGOUT).then(({ data }) => {
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
