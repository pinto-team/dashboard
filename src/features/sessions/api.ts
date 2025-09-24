import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

import type { RawSessionRecord, SessionRecord, SessionsResponse } from './model/types'

type RequestOptions = {
    signal?: AbortSignal
    params?: Record<string, unknown>
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function toOptionalString(value: unknown): string | null {
    if (value === undefined || value === null) return null
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
    }
    return null
}

function toOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') {
        if (Number.isNaN(value)) return undefined
        return value !== 0
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()
        if (!normalized) return undefined
        if (['true', '1', 'yes', 'y'].includes(normalized)) return true
        if (['false', '0', 'no', 'n'].includes(normalized)) return false
    }
    return undefined
}

function pickValue(source: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
        if (key in source) {
            const value = source[key]
            if (value !== undefined) {
                return value
            }
        }
    }
    return undefined
}

function normalizeSessionRecord(raw: RawSessionRecord | SessionRecord | unknown): SessionRecord | null {
    if (!isRecord(raw)) {
        return null
    }

    const pickString = (...keys: string[]) => toOptionalString(pickValue(raw, keys))
    const pickBoolean = (...keys: string[]) => toOptionalBoolean(pickValue(raw, keys))

    const sessionId = pickString('session_id', 'sessionId', 'id')
    if (!sessionId) {
        return null
    }

    return {
        session_id: sessionId,
        app_context: pickString('app_context', 'appContext'),
        locale: pickString('locale'),
        ip_address: pickString('ip_address', 'ipAddress'),
        user_agent: pickString('user_agent', 'userAgent'),
        device_id: pickString('device_id', 'deviceId'),
        platform: pickString('platform'),
        platform_version: pickString('platform_version', 'platformVersion'),
        browser_name: pickString('browser_name', 'browserName'),
        browser_system_name: pickString('browser_system_name', 'browserSystemName'),
        browser_system_version: pickString('browser_system_version', 'browserSystemVersion'),
        app_version: pickString('app_version', 'appVersion'),
        status: pickString('status'),
        issued_at: pickString('issued_at', 'issuedAt'),
        expires_at: pickString('expires_at', 'expiresAt'),
        revoked_at: pickString('revoked_at', 'revokedAt'),
        is_current: pickBoolean('is_current', 'isCurrent'),
    }
}

function normalizeSessions(payload: SessionsResponse['data']): SessionRecord[] {
    if (!payload) {
        return []
    }

    if (Array.isArray(payload)) {
        return payload
            .map((item) => normalizeSessionRecord(item))
            .filter((item): item is SessionRecord => Boolean(item))
    }

    const record = normalizeSessionRecord(payload)
    return record ? [record] : []
}

export async function fetchCurrentSession({
    signal,
    params,
}: RequestOptions = {}): Promise<SessionRecord | null> {
    const { data } = await authClient.get<SessionsResponse>(API_ROUTES.SESSIONS.CURRENT, {
        signal,
        params: params ?? { offset: 0, limit: 1 },
    })

    const sessions = normalizeSessions(data?.data)
    return sessions[0] ?? null
}

export async function fetchOtherSessions({ signal }: RequestOptions = {}): Promise<SessionRecord[]> {
    const { data } = await authClient.get<SessionsResponse>(API_ROUTES.SESSIONS.ME_OTHERS, {
        signal,
    })

    return normalizeSessions(data?.data)
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
