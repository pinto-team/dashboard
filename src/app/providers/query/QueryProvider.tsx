// app/providers/query/QueryProvider.tsx
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query"
import { ReactNode } from "react"
import { GlobalLoader } from "@/components/ui/global-loader"
import { showErrorToastOutside } from "@/lib/errors"

const client = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => { showErrorToastOutside(error) },
    }),
    mutationCache: new MutationCache({
        onError: (error) => { showErrorToastOutside(error) },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
        },
        mutations: { retry: 0 },
    },
})

export default function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={client}>
            <GlobalLoader showOverlay={false} />
            {children}
        </QueryClientProvider>
    )
}
