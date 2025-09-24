import { useCallback } from 'react'

import type { SessionRecord } from '@/features/sessions/model/types'
import { useI18n } from '@/shared/hooks/useI18n'

export type SessionDetailItem = {
    key: string
    label: string
    value: string
}

export type SessionDetailGroup = {
    key: string
    title: string
    items: SessionDetailItem[]
}

export function useSessionFormatter() {
    const { t, locale } = useI18n()
    const fallbackLabel = t('sessions.value.not_available') as string

    const formatDateTime = useCallback(
        (value?: string | null) => {
            if (!value) return fallbackLabel
            const timestamp = Date.parse(value)
            if (Number.isNaN(timestamp)) return fallbackLabel
            const date = new Date(timestamp)
            try {
                return new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }).format(date)
            } catch {
                return date.toLocaleString()
            }
        },
        [fallbackLabel, locale],
    )

    const buildPlatform = useCallback((session: SessionRecord) => {
        const parts = [session.platform, session.platform_version].filter(Boolean)
        return parts.join(' ')
    }, [])

    const buildBrowser = useCallback((session: SessionRecord) => {
        const parts = [session.browser_name, session.browser_system_name, session.browser_system_version]
            .filter(Boolean)
            .join(' • ')
        return parts
    }, [])

    const buildDisplayName = useCallback(
        (session: SessionRecord) => {
            const primary = session.browser_name || session.platform || session.app_context
            return primary || fallbackLabel
        },
        [fallbackLabel],
    )

    const getStatusLabel = useCallback(
        (session: SessionRecord) => {
            if (session.revoked_at) {
                return t('sessions.status.revoked') as string
            }
            const status = session.status?.toLowerCase()
            const key = status ? `sessions.status.${status}` : 'sessions.status.unknown'
            const label = t(key)
            const value = typeof label === 'string' ? label : String(label)
            return value === key && status ? status : value
        },
        [t],
    )

    const mapDetails = useCallback(
        (session: SessionRecord): SessionDetailItem[] => {
            const detailFallback = fallbackLabel
            return [
                { key: 'status', label: t('sessions.fields.status') as string, value: getStatusLabel(session) },
                { key: 'ip_address', label: t('sessions.fields.ip_address') as string, value: session.ip_address || detailFallback },
                { key: 'issued_at', label: t('sessions.fields.issued_at') as string, value: formatDateTime(session.issued_at) },
                { key: 'expires_at', label: t('sessions.fields.expires_at') as string, value: formatDateTime(session.expires_at) },
                {
                    key: 'revoked_at',
                    label: t('sessions.fields.revoked_at') as string,
                    value: session.revoked_at ? formatDateTime(session.revoked_at) : detailFallback,
                },
                { key: 'app_context', label: t('sessions.fields.app_context') as string, value: session.app_context || detailFallback },
                { key: 'platform', label: t('sessions.fields.platform') as string, value: buildPlatform(session) || detailFallback },
                { key: 'browser', label: t('sessions.fields.browser') as string, value: buildBrowser(session) || detailFallback },
                { key: 'locale', label: t('sessions.fields.locale') as string, value: session.locale || detailFallback },
                { key: 'app_version', label: t('sessions.fields.app_version') as string, value: session.app_version || detailFallback },
                { key: 'device_id', label: t('sessions.fields.device_id') as string, value: session.device_id || detailFallback },
                { key: 'user_agent', label: t('sessions.fields.user_agent') as string, value: session.user_agent || detailFallback },
                { key: 'session_id', label: t('sessions.fields.session_id') as string, value: session.session_id || detailFallback },
            ]
        },
        [buildBrowser, buildPlatform, formatDateTime, getStatusLabel, t, fallbackLabel],
    )

    const getSummaryDetails = useCallback(
        (session: SessionRecord): SessionDetailItem[] => {
            const details = mapDetails(session)
            const summaryOrder = ['ip_address', 'browser', 'issued_at']
            return summaryOrder
                .map((key) => details.find((item) => item.key === key))
                .filter((item): item is SessionDetailItem => Boolean(item && item.value && item.value !== fallbackLabel))
        },
        [fallbackLabel, mapDetails],
    )

    const getDetailGroups = useCallback(
        (session: SessionRecord): SessionDetailGroup[] => {
            const details = mapDetails(session)
            const pick = (keys: string[]) =>
                details.filter((item) => keys.includes(item.key) && item.value && item.value.length > 0)

            const groups: SessionDetailGroup[] = [
                {
                    key: 'sessions.details.groups.activity',
                    title: t('sessions.details.groups.activity') as string,
                    items: pick(['status', 'ip_address', 'issued_at', 'expires_at', 'revoked_at']),
                },
                {
                    key: 'sessions.details.groups.device',
                    title: t('sessions.details.groups.device') as string,
                    items: pick(['platform', 'browser', 'locale', 'app_version', 'app_context', 'device_id']),
                },
                {
                    key: 'sessions.details.groups.metadata',
                    title: t('sessions.details.groups.metadata') as string,
                    items: pick(['session_id', 'user_agent']),
                },
            ]

            return groups.filter((group) => group.items.length > 0)
        },
        [mapDetails, t],
    )

    return {
        fallbackLabel,
        formatDateTime,
        buildDisplayName,
        buildPlatform,
        buildBrowser,
        getStatusLabel,
        mapDetails,
        getSummaryDetails,
        getDetailGroups,
    }
}
