// features/auth/hooks/auth.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { defaultLogger } from '@/shared/lib/logger'

import { apiForgotPassword, apiLogin, apiLogout, apiMe, apiRegister } from '../services/auth.api'
import { clearAuthStorage, getAccessToken } from '../storage'

// Query keys
export const authQueryKeys = {
    all: ['auth'] as const,
    user: () => [...authQueryKeys.all, 'user'] as const,
    profile: () => [...authQueryKeys.all, 'profile'] as const,
} as const

// Login mutation
export function useLogin() {
    const queryClient = useQueryClient()
    const logger = defaultLogger.withContext({ component: 'auth.queries', action: 'useLogin' })

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            apiLogin(username, password),
        onSuccess: (data) => {
            logger.info('Login successful, updating auth state')
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
            queryClient.invalidateQueries({ queryKey: authQueryKeys.profile() })
        },
        onError: (error) => {
            logger.error('Login failed', { error })
        },
    })
}

// Logout mutation
export function useLogout() {
    const queryClient = useQueryClient()
    const logger = defaultLogger.withContext({ component: 'auth.queries', action: 'useLogout' })

    return useMutation({
        mutationFn: apiLogout,
        onSuccess: () => {
            logger.info('Logout successful, clearing auth state')
            clearAuthStorage()
            // Clear all queries
            queryClient.clear()
        },
        onError: (error) => {
            logger.error('Logout failed', { error })
            // Still clear local storage on error
            clearAuthStorage()
            queryClient.clear()
        },
    })
}

// User profile query
export function useUserProfile() {
    const token = getAccessToken()

    return useQuery({
        queryKey: authQueryKeys.profile(),
        queryFn: () => apiMe(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Registration mutation
export function useRegister() {
    const queryClient = useQueryClient()
    const logger = defaultLogger.withContext({ component: 'auth.queries', action: 'useRegister' })

    return useMutation({
        mutationFn: (userData: {
            username: string
            email: string
            password: string
            firstName?: string
            lastName?: string
        }) => apiRegister(userData),
        onSuccess: (data) => {
            logger.info('Registration successful')
            // Could automatically log in the user here
        },
        onError: (error) => {
            logger.error('Registration failed', { error })
        },
    })
}

// Forgot password mutation
export function useForgotPassword() {
    const logger = defaultLogger.withContext({
        component: 'auth.queries',
        action: 'useForgotPassword',
    })

    return useMutation({
        mutationFn: (email: string) => apiForgotPassword(email),
        onSuccess: (data) => {
            logger.info('Password reset request successful')
        },
        onError: (error) => {
            logger.error('Password reset request failed', { error })
        },
    })
}

// Auth state hook
export function useAuth() {
    const { data: user, isLoading, error } = useUserProfile()
    const logoutMutation = useLogout()

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    }
}
