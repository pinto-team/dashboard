import { QueryClientProvider } from '@tanstack/react-query'

import { ReactNode } from 'react'

import { queryClient } from '@/lib/react-query'

/**
 * Provides a shared QueryClient to the React tree.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
