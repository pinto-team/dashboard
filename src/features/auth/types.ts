// features/auth/types.ts
export type AuthUser = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    image?: string
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
