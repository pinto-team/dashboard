/**
 * Axios client factory and preconfigured instances.
 *
 * Responsibilities:
 * - Configure base axios instances per feature with sensible defaults
 * - Attach Authorization header from storage when enabled
 * - Log requests/responses in development
 * - Handle 401 responses with a robust single-flight refresh flow
 * - Queue pending 401 requests until a new token is issued
 *
 * How refresh works:
 * - On a 401, the first request triggers a refresh call using refresh token
 * - Concurrent 401s are queued and resolved when refresh succeeds
 * - Original requests are retried with the new access token
 */
import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios'

import {
    clearAuthStorage,
    getAccessToken,
    getRefreshToken,
    setTokens,
} from '@/features/auth/storage'
import { API_CONFIG } from '@/shared/config/api.config'
import { defaultLogger } from '@/shared/lib/logger'

/** Resolver pair used to unblock queued requests after refresh */
type PendingResolver = {
    resolve: (token: string) => void
    reject: (reason?: unknown) => void
}

/** Minimal shape returned by the refresh endpoint */
type RefreshResponse = {
    accessToken: string
    refreshToken: string
}

/** Options for creating a feature-scoped axios instance */
type ClientConfig = {
    baseURL: string
    feature?: string
    enableAuth?: boolean
    enableRefresh?: boolean
}

/** Internal flag used to avoid infinite retry loops */
const RETRY_FLAG = '__isRetryRequest'

// Single-flight refresh guard and queue for pending 401s
let isRefreshing = false
let pendingQueue: PendingResolver[] = []

/** Normalize headers into a mutable AxiosHeaders instance */
function toAxiosHeaders(h?: unknown): AxiosHeaders {
    if (!h) return new AxiosHeaders()
    return h instanceof AxiosHeaders ? h : new AxiosHeaders(h as Record<string, string>)
}

/** Resolve or reject all pending queued 401 requests */
function processQueue(error: unknown | null, token?: string) {
    if (error) {
        pendingQueue.forEach(({ reject }) => reject(error))
    } else if (token) {
        pendingQueue.forEach(({ resolve }) => resolve(token))
    }
    pendingQueue = []
}

/** Set Authorization header on a given axios config */
function setAuthHeaderOnConfig(config: AxiosRequestConfig, token: string) {
    const headers = toAxiosHeaders(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
}

/** Create a preconfigured axios instance for a specific feature */
function createApiClient(config: ClientConfig): AxiosInstance {
    const instance = axios.create({
        baseURL: config.baseURL,
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
        timeout: 10000, // تایم‌اوت 10 ثانیه
    })

    if (config.feature) {
        instance.defaults.headers.common['X-Feature'] = config.feature
    }

    instance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            const token = getAccessToken()
            if (token && config.enableAuth) {
                const headers = toAxiosHeaders(requestConfig.headers)
                if (!headers.has('Authorization')) {
                    headers.set('Authorization', `Bearer ${token}`)
                }
                requestConfig.headers = headers
            }

            if (API_CONFIG.DEV.LOG_REQUESTS) {
                defaultLogger.info('API Request', {
                    method: requestConfig.method?.toUpperCase(),
                    url: requestConfig.url,
                    baseURL: requestConfig.baseURL,
                    hasAuth: !!token,
                    feature: config.feature,
                })
            }

            return requestConfig
        },
        (err) => Promise.reject(err),
    )

    instance.interceptors.response.use(
        (response) => {
            if (API_CONFIG.DEV.LOG_RESPONSES) {
                defaultLogger.info('API Response', {
                    status: response.status,
                    url: response.config.url,
                    method: response.config.method?.toUpperCase(),
                    feature: config.feature,
                })
            }
            return response
        },
        (error: AxiosError) => {
            defaultLogger.error('API Error', {
                status: error.response?.status,
                url: error.config?.url,
                method: (error.config as AxiosRequestConfig | undefined)?.method?.toUpperCase(),
                message: error.message,
                data: error.response?.data,
                feature: config.feature,
            })
            return Promise.reject(error)
        },
    )

    if (config.enableRefresh !== false) {
        instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as
                    | (InternalAxiosRequestConfig & {
                          [RETRY_FLAG]?: boolean
                      })
                    | undefined
                const status = error.response?.status

                if (status !== 401 || !originalRequest || originalRequest[RETRY_FLAG]) {
                    return Promise.reject(error)
                }

                if (isRefreshing) {
                    try {
                        const newToken = await new Promise<string>((resolve, reject) => {
                            pendingQueue.push({ resolve, reject })
                        })
                        setAuthHeaderOnConfig(originalRequest, newToken)
                        return instance(originalRequest)
                    } catch (e) {
                        return Promise.reject(e)
                    }
                }

                originalRequest[RETRY_FLAG] = true
                isRefreshing = true

                try {
                    const rt = getRefreshToken()
                    if (!rt) {
                        throw error
                    }

                    const refreshUrl = `${API_CONFIG.AUTH.BASE_URL}/auth/refresh`

                    const { data } = await axios.post<RefreshResponse>(
                        refreshUrl,
                        { refreshToken: rt },
                        { headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) },
                    )

                    const newAccess = data.accessToken
                    const newRefresh = data.refreshToken

                    setTokens(newAccess, newRefresh)
                    instance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`

                    processQueue(null, newAccess)

                    setAuthHeaderOnConfig(originalRequest, newAccess)
                    return instance(originalRequest)
                } catch (refreshErr) {
                    processQueue(refreshErr)
                    clearAuthStorage()
                    return Promise.reject(refreshErr)
                } finally {
                    isRefreshing = false
                }
            },
        )
    }

    return instance
}

/** Default API client for the primary backend */
export const apiClient = createApiClient({
    baseURL: API_CONFIG.BASE_URL,
    enableAuth: true,
    enableRefresh: true,
})

/** Auth-scoped client (talks to auth service) */
export const authClient = createApiClient({
    baseURL: API_CONFIG.AUTH.BASE_URL,
    feature: 'auth',
    enableAuth: true,
    enableRefresh: true,
})

/** Catalog-scoped client example (refresh disabled if opaque tokens) */
export const catalogClient = createApiClient({
    baseURL: API_CONFIG.CATALOG.BASE_URL || 'http://localhost:8000',
    feature: 'catalog',
    enableAuth: true,
    enableRefresh: false,
})

/** Factory to create additional feature clients on demand */
export function createFeatureClient(config: ClientConfig): AxiosInstance {
    return createApiClient(config)
}

export default apiClient
