import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

import type { SessionRecord, SessionsResponse } from './model/types'

type RequestOptions = {
    signal?: AbortSignal
    params?: Record<string, unknown>
}

export async function fetchCurrentSession({
    signal,
    params,
}: RequestOptions = {}): Promise<SessionRecord | null> {
    const { data } = await authClient.get<SessionsResponse>(API_ROUTES.SESSIONS.CURRENT, {
        signal,
        params: params ?? { offset: 0, limit: 1 },
    })

    return data?.data?.[0] ?? null
}

export async function fetchOtherSessions({ signal }: RequestOptions = {}): Promise<SessionRecord[]> {
    const { data } = await authClient.get<SessionsResponse>(API_ROUTES.SESSIONS.ME_OTHERS, {
        signal,
    })

    return data?.data ?? []
}

export async function revokeOtherSessions(): Promise<void> {
    await authClient.delete(API_ROUTES.SESSIONS.ME_OTHERS)
}

export async function revokeAllSessions(): Promise<void> {
    await authClient.delete(API_ROUTES.SESSIONS.ME_ALL)
}

export async function revokeSessionById(sessionId: string): Promise<void> {
    await authClient.delete(API_ROUTES.SESSIONS.BY_ID(sessionId))
}

export async function revokeCurrentSession(): Promise<void> {
    await authClient.delete(API_ROUTES.SESSIONS.CURRENT)
}
