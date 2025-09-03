// lib/react-query.ts
/**
 * Global QueryClient configuration.
 *
 * Guidelines:
 * - Keep retries low by default; tune per-query if needed
 * - Avoid refetch on window focus to reduce noise in admin apps
 */
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})
