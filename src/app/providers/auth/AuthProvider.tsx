import { ReactNode, useEffect, useState } from 'react'

import { apiLogin, apiMe, apiRefresh } from '@/features/auth/services/auth.api.ts'
import {
    clearAuthStorage,
    getAccessToken,
    getCachedUser,
    getRefreshToken,
    setCachedUser,
    setTokens,
} from '@/features/auth/storage.ts'
import { AuthUser } from '@/features/auth/types.ts'
import { HttpError } from '@/lib/http-error.ts'

import { AuthContext } from './auth-context'

/**
 * AuthProvider bootstraps auth state from storage and exposes auth context.
 *
 * Behaviors:
 * - On mount, reads tokens and cached user to optimistically set state
 * - Validates the access token by calling `me`; falls back to refresh if needed
 * - Performs a hard logout when validation/refresh fails
 */

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [accessToken, setAT] = useState<string | null>(null)
    const [refreshToken, setRT] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    // bootstrap
    useEffect(() => {
        const at = getAccessToken()
        const rt = getRefreshToken()
        const cachedUser = getCachedUser<AuthUser>()

        if (at && cachedUser) {
            setAT(at)
            setRT(rt)
            setUser(cachedUser)
            setReady(true)

            apiMe(at).catch(async () => {
                if (rt) {
                    try {
                        const r = await apiRefresh(rt)
                        setAT(r.accessToken)
                        setRT(r.refreshToken)
                        setTokens(r.accessToken, r.refreshToken)
                    } catch {
                        hardLogout()
                    }
                } else {
                    hardLogout()
                }
            })
        } else {
            setReady(true)
        }
    }, [])

    /** Clear all auth state and storage */
    function hardLogout() {
        setUser(null)
        setAT(null)
        setRT(null)
        clearAuthStorage()
    }

    /** Perform credential login and persist tokens/user */
    async function login({ username, password }: { username: string; password: string }) {
        try {
            const r = await apiLogin(username, password)
            setAT(r.accessToken)
            setRT(r.refreshToken)

            const u: AuthUser = {
                id: r.id,
                username: r.username,
                email: r.email,
                firstName: r.firstName,
                lastName: r.lastName,
                image: r.image,
            }

            setUser(u)
            setTokens(r.accessToken, r.refreshToken)
            setCachedUser(u)
        } catch (err: unknown) {
            if (err instanceof HttpError) throw new Error(err.message)
            if (err instanceof Error) throw err
            throw new Error('Unknown login error')
        }
    }

    /** Logout current user and clear state */
    function logout() {
        hardLogout()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                isAuthenticated: Boolean(user && accessToken),
                ready,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
