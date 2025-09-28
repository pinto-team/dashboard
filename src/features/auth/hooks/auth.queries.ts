// features/auth/hooks/auth.queries.ts
import { useMutation } from '@tanstack/react-query'

import { defaultLogger } from '@/shared/lib/logger'

import { apiLogin } from '../services/auth.api'

// Login mutation
export function useLogin() {
    const logger = defaultLogger.withContext({ component: 'auth.queries', action: 'useLogin' })

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            apiLogin(username, password),
        onSuccess: () => {
            logger.info('Login successful')
        },
        onError: (error) => {
            logger.error('Login failed', { error })
        },
    })
}
