import { ReactNode, useEffect, useState } from "react"

import { apiLogin, apiMe, apiRefresh } from "@/features/auth/services/auth.api"
import {
    clearAuthStorage,
    getAccessToken,
    getCachedUser,
    getRefreshToken,
    setCachedUser,
    setTokens,
} from "@/features/auth/storage"
import { AuthUser } from "@/features/auth/types"
import { HttpError } from "@/lib/http-error"

import { AuthContext } from "./auth-context"

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    /** Clear all auth state and storage */
    function hardLogout() {
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
        clearAuthStorage()
    }

    /** Perform credential login and persist tokens/user */
    async function login({
                             username,
                             password,
                         }: {
        username: string
        password: string
    }) {
        try {
            const r = await apiLogin(username, password)
            setAccessToken(r.accessToken)
            setRefreshToken(r.refreshToken)

            const u: AuthUser = r.user

            setUser(u)
            setTokens(r.accessToken, r.refreshToken)
            setCachedUser(u)
        } catch (err: unknown) {
            if (err instanceof HttpError) throw new Error(err.message)
            if (err instanceof Error) throw err
            throw new Error("auth.unknownLoginError")
        }
    }

    /** Logout current user and clear state */
    function logout() {
        hardLogout()
    }

    // bootstrap on mount
    useEffect(() => {
        let isActive = true

        const at = getAccessToken()
        const rt = getRefreshToken()
        const cachedUser = getCachedUser<AuthUser>()

        if (at && cachedUser) {
            setAccessToken(at)
            setRefreshToken(rt)
            setUser(cachedUser)
            setReady(true)

            apiMe(at).catch(async () => {
                if (!isActive) return
                if (rt) {
                    try {
                        const r = await apiRefresh(rt)
                        setAccessToken(r.accessToken)
                        setRefreshToken(r.refreshToken)
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

        return () => {
            isActive = false
        }
    }, [])

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
