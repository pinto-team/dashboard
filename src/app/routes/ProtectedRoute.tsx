import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth.ts'

/**
 * Guards child routes behind authentication.
 * While auth state is bootstrapping, renders nothing to avoid flicker.
 */
export default function ProtectedRoute() {
    const { isAuthenticated, ready } = useAuth()
    const loc = useLocation()
    if (!ready) return null
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: loc }} />
}
