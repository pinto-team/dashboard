// features/auth/storage.ts
export const LS_KEYS = {
    ACCESS_TOKEN: 'auth.accessToken',
    REFRESH_TOKEN: 'auth.refreshToken',
    USER: 'auth.user',
} as const

export function getAccessToken(): string | null {
    return localStorage.getItem(LS_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(LS_KEYS.REFRESH_TOKEN)
}

export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(LS_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(LS_KEYS.REFRESH_TOKEN, refreshToken)
}

export function clearTokens(): void {
    localStorage.removeItem(LS_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LS_KEYS.REFRESH_TOKEN)
}

export function getCachedUser<T = unknown>(): T | null {
    const raw = localStorage.getItem(LS_KEYS.USER)
    if (!raw) return null
    try {
        return JSON.parse(raw) as T
    } catch {
        return null
    }
}

export function setCachedUser(user: unknown): void {
    localStorage.setItem(LS_KEYS.USER, JSON.stringify(user))
}

export function clearCachedUser(): void {
    localStorage.removeItem(LS_KEYS.USER)
}

export function clearAuthStorage(): void {
    clearTokens()
    clearCachedUser()
}
