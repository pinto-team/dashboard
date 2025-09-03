// app/providers/auth/auth-context.ts
import { createContext } from 'react'

import type { AuthCtx } from '@/features/auth/types'

export const AuthContext = createContext<AuthCtx | null>(null)
