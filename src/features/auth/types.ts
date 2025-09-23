// features/auth/types.ts
export type AuthUser = {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    avatar?: string
}

export type AuthLoginResult = {
    accessToken: string
    refreshToken: string
    idToken: string | null
    expiresIn: number
    tokenType: string
    audience: string[]
    user: AuthUser
}

export type AuthCtx = {
    user: AuthUser | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    ready: boolean
    login: (params: { username: string; password: string }) => Promise<void> // eslint-disable-line no-unused-vars
    logout: () => void
}
