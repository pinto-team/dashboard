import { ReactNode, useCallback, useEffect, useState } from "react"

import { apiLogin, apiLogout, apiRefresh } from "@/features/auth/services/auth.api"
import {
    clearAuthStorage,
    getAccessToken,
    getCachedUser,
    getRefreshToken,
    getSessionId as getStoredSessionId,
    setCachedUser,
    setSessionId as persistSessionId,
    setTokens,
} from "@/features/auth/storage"
import { AuthUser } from "@/features/auth/types"
import { HttpError } from "@/lib/http-error"
import { onForcedLogout, onTokenRefreshed } from "@/features/auth/lib/auth-events"
import { defaultLogger } from "@/shared/lib/logger"

import { AuthContext } from "./auth-context"

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    const hardLogout = useCallback(() => {
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
        setSessionId(null)
        clearAuthStorage()
    }, [])

    async function login({
        username,
        password,
    }: {
        username: string
        password: string
    }) {
        try {
            const result = await apiLogin(username, password)

            setAccessToken(result.accessToken)
            setRefreshToken(result.refreshToken)

            const session = result.sessionId ?? null
            setSessionId(session)

            const authenticatedUser: AuthUser = result.user
            setUser(authenticatedUser)

            setTokens(result.accessToken, result.refreshToken)
            setCachedUser(authenticatedUser)
            persistSessionId(session)
        } catch (err: unknown) {
            if (err instanceof HttpError) throw new Error(err.message)
            if (err instanceof Error) throw err
            throw new Error("auth.unknownLoginError")
        }
    }

    function logout() {
        const sid = sessionId ?? getStoredSessionId()

        const performLogout = async () => {
            if (sid) {
                try {
                    await apiLogout(sid)
                } catch (error) {
                    defaultLogger.error("Failed to revoke session during logout", { error })
                }
            }

            hardLogout()
        }

        void performLogout()
    }

    useEffect(() => {
        let isActive = true

        const at = getAccessToken()
        const rt = getRefreshToken()
        const cachedUser = getCachedUser<AuthUser>()
        const storedSessionId = getStoredSessionId()

        if (storedSessionId) {
            setSessionId(storedSessionId)
        }

        if (at) {
            setAccessToken(at)
        }
        if (rt) {
            setRefreshToken(rt)
        }
        if (cachedUser) {
            setUser(cachedUser)
        }

        if (rt && !cachedUser) {
            ;(async () => {
                try {
                    const response = await apiRefresh(rt)
                    if (!isActive) return

                    setAccessToken(response.accessToken)
                    setRefreshToken(response.refreshToken)
                    setTokens(response.accessToken, response.refreshToken)

                    if (response.user) {
                        setUser(response.user)
                        setCachedUser(response.user)
                    }

                    if (response.sessionId) {
                        setSessionId(response.sessionId)
                        persistSessionId(response.sessionId)
                    }
                } catch {
                    if (!isActive) return
                    hardLogout()
                } finally {
                    if (isActive) {
                        setReady(true)
                    }
                }
            })()
        } else {
            setReady(true)
        }

        return () => {
            isActive = false
        }
    }, [hardLogout])

    useEffect(() => {
        const unsubscribeLogout = onForcedLogout((payload) => {
            hardLogout()
            if (payload?.redirect !== false) {
                window.location.replace("/login")
            }
        })

        const unsubscribeTokenUpdate = onTokenRefreshed(
            ({ accessToken: nextAccessToken, refreshToken: nextRefreshToken, sessionId: nextSessionId }) => {
                setAccessToken(nextAccessToken)
                setRefreshToken(nextRefreshToken)

                if (nextSessionId) {
                    setSessionId(nextSessionId)
                    persistSessionId(nextSessionId)
                }
            },
        )

        return () => {
            unsubscribeLogout()
            unsubscribeTokenUpdate()
        }
    }, [hardLogout])

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                sessionId,
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
