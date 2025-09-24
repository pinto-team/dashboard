export type SessionRecord = {
    session_id: string
    app_context?: string | null
    locale?: string | null
    ip_address?: string | null
    user_agent?: string | null
    device_id?: string | null
    platform?: string | null
    platform_version?: string | null
    browser_name?: string | null
    browser_system_name?: string | null
    browser_system_version?: string | null
    app_version?: string | null
    status?: string | null
    issued_at?: string | null
    expires_at?: string | null
    revoked_at?: string | null
    is_current?: boolean
}

export type SessionsResponse = {
    data?: SessionRecord[] | null
    meta?: unknown
}
