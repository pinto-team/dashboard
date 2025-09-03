// features/auth/hooks/useAuth.ts
import { useContext } from 'react'

import { AuthContext } from '@/app/providers/auth/auth-context.ts'

/**
 * Hook to access the AuthContext with a helpful invariant.
 */
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
