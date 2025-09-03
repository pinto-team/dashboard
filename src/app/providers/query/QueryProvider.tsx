// app/providers/query/QueryProvider.tsx
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactNode } from "react";
import { GlobalLoader } from "@/components/ui/global-loader";
import { showErrorToast } from '@/lib/errors.ts'

const client = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => { showErrorToast(error); },
    }),
    mutationCache: new MutationCache({
        onError: (error) => { showErrorToast(error); },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 60_000, // 1 min
        },
        mutations: { retry: 0 },
    },
});

export default function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={client}>
            <GlobalLoader showOverlay={false} />
            {children}
            {/* اگر devtools می‌خواهی:
          1) پکیج را نصب کن: pnpm add -D @tanstack/react-query-devtools
          2) سپس این را باز کن:
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
    );
}
