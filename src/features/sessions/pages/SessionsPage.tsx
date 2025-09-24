import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/layout/DashboardLayout'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
    fetchCurrentSession,
    fetchOtherSessions,
    revokeAllSessions,
    revokeCurrentSession,
    revokeOtherSessions,
    revokeSessionById,
} from '@/features/sessions/api'
import type { SessionRecord } from '@/features/sessions/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'

const sessionQueryKeys = {
    all: ['sessions'] as const,
    current: () => ['sessions', 'current'] as const,
    others: () => ['sessions', 'others'] as const,
}

type DetailItem = {
    key: string
    label: string
    value: string
}

function buildDisplayName(session: SessionRecord, fallback: string) {
    const primary = session.browser_name || session.platform || session.app_context
    if (primary) {
        return primary
    }
    return fallback
}

function buildPlatform(session: SessionRecord) {
    const parts = [session.platform, session.platform_version].filter(Boolean)
    return parts.join(' ')
}

function buildBrowser(session: SessionRecord) {
    const parts = [session.browser_name, session.browser_system_name, session.browser_system_version]
        .filter(Boolean)
        .join(' • ')
    return parts
}

export default function SessionsPage() {
    const { t, locale } = useI18n()
    const { logout } = useAuth()
    const isRTL = isRTLLocale(locale)
    const queryClient = useQueryClient()

    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null)

    const formatDateTime = useCallback(
        (value?: string | null) => {
            if (!value) {
                return t('sessions.value.not_available') as string
            }

            const timestamp = Date.parse(value)
            if (Number.isNaN(timestamp)) {
                return t('sessions.value.not_available') as string
            }

            const date = new Date(timestamp)
            try {
                return new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }).format(date)
            } catch (error) {
                return date.toLocaleString()
            }
        },
        [locale, t],
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

            if (value === key && status) {
                return status
            }

            return value
        },
        [t],
    )

    const mapSessionDetails = useCallback(
        (session: SessionRecord): DetailItem[] => {
            const fallback = t('sessions.value.not_available') as string

            return [
                {
                    key: 'session_id',
                    label: t('sessions.fields.session_id') as string,
                    value: session.session_id,
                },
                {
                    key: 'status',
                    label: t('sessions.fields.status') as string,
                    value: getStatusLabel(session),
                },
                {
                    key: 'ip_address',
                    label: t('sessions.fields.ip_address') as string,
                    value: session.ip_address || fallback,
                },
                {
                    key: 'app_context',
                    label: t('sessions.fields.app_context') as string,
                    value: session.app_context || fallback,
                },
                {
                    key: 'locale',
                    label: t('sessions.fields.locale') as string,
                    value: session.locale || fallback,
                },
                {
                    key: 'platform',
                    label: t('sessions.fields.platform') as string,
                    value: buildPlatform(session) || fallback,
                },
                {
                    key: 'browser',
                    label: t('sessions.fields.browser') as string,
                    value: buildBrowser(session) || fallback,
                },
                {
                    key: 'device_id',
                    label: t('sessions.fields.device_id') as string,
                    value: session.device_id || fallback,
                },
                {
                    key: 'user_agent',
                    label: t('sessions.fields.user_agent') as string,
                    value: session.user_agent || fallback,
                },
                {
                    key: 'app_version',
                    label: t('sessions.fields.app_version') as string,
                    value: session.app_version || fallback,
                },
                {
                    key: 'issued_at',
                    label: t('sessions.fields.issued_at') as string,
                    value: formatDateTime(session.issued_at),
                },
                {
                    key: 'expires_at',
                    label: t('sessions.fields.expires_at') as string,
                    value: formatDateTime(session.expires_at),
                },
                {
                    key: 'revoked_at',
                    label: t('sessions.fields.revoked_at') as string,
                    value: session.revoked_at ? formatDateTime(session.revoked_at) : fallback,
                },
            ]
        },
        [formatDateTime, getStatusLabel, t],
    )

    const invalidateSessions = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all, exact: false })
    }, [queryClient])

    const currentSessionQuery = useQuery({
        queryKey: sessionQueryKeys.current(),
        queryFn: ({ signal }) => fetchCurrentSession({ signal }),
    })

    const otherSessionsQuery = useQuery({
        queryKey: sessionQueryKeys.others(),
        queryFn: ({ signal }) => fetchOtherSessions({ signal }),
    })

    const revokeOthersMutation = useMutation({
        mutationFn: () => revokeOtherSessions(),
        onSuccess: async () => {
            toast.success(t('sessions.toasts.revoked_others') as string)
            setDetailsOpen(false)
            setSelectedSession(null)
            await invalidateSessions()
        },
    })

    const revokeAllMutation = useMutation({
        mutationFn: () => revokeAllSessions(),
        onSuccess: async () => {
            toast.success(t('sessions.toasts.revoked_all') as string)
            setDetailsOpen(false)
            setSelectedSession(null)
            await invalidateSessions()
            logout()
        },
    })

    const revokeSessionMutation = useMutation({
        mutationFn: (sessionId: string) => revokeSessionById(sessionId),
        onSuccess: async (_data, sessionId) => {
            toast.success(t('sessions.toasts.revoked_single') as string)
            let shouldClose = false
            setSelectedSession((prev) => {
                if (prev?.session_id === sessionId) {
                    shouldClose = true
                    return null
                }
                return prev
            })
            if (shouldClose) {
                setDetailsOpen(false)
            }
            await invalidateSessions()
        },
    })

    const revokeCurrentMutation = useMutation({
        mutationFn: () => revokeCurrentSession(),
        onSuccess: async () => {
            toast.success(t('sessions.toasts.revoked_current') as string)
            setDetailsOpen(false)
            setSelectedSession(null)
            await invalidateSessions()
            logout()
        },
    })

    const isRevokingSelected = revokeSessionMutation.isPending || revokeCurrentMutation.isPending

    const currentSession = currentSessionQuery.data
    const otherSessions = otherSessionsQuery.data ?? []

    const currentSessionDetails = useMemo(
        () => (currentSession ? mapSessionDetails(currentSession) : []),
        [currentSession, mapSessionDetails],
    )

    const selectedSessionDetails = useMemo(
        () => (selectedSession ? mapSessionDetails(selectedSession) : []),
        [mapSessionDetails, selectedSession],
    )

    const handleDetailsOpenChange = useCallback((open: boolean) => {
        setDetailsOpen(open)
        if (!open) {
            setSelectedSession(null)
        }
    }, [])

    const handleSelectSession = useCallback((session: SessionRecord) => {
        setSelectedSession(session)
        setDetailsOpen(true)
    }, [])

    const handleOpenCurrentDetails = useCallback(() => {
        if (!currentSession) return
        const sessionWithFlag: SessionRecord = {
            ...currentSession,
            is_current: true,
        }
        setSelectedSession(sessionWithFlag)
        setDetailsOpen(true)
    }, [currentSession])

    const handleRevokeSelected = useCallback(async () => {
        if (!selectedSession) return

        if (selectedSession.is_current) {
            await revokeCurrentMutation.mutateAsync()
            return
        }

        await revokeSessionMutation.mutateAsync(selectedSession.session_id)
    }, [revokeCurrentMutation, revokeSessionMutation, selectedSession])

    const detailSheetSide = isRTL ? 'left' : 'right'
    const fallbackDeviceLabel = t('sessions.fields.unknown_device') as string

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-6 py-4 md:py-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="px-4 lg:px-6 space-y-1.5">
                    <h1 className="text-2xl font-bold tracking-tight">{t('sessions.title')}</h1>
                    <p className="text-muted-foreground text-sm">{t('sessions.description')}</p>
                </div>

                <div className="px-4 lg:px-6 space-y-6">
                    <Card>
                        <CardHeader className="gap-1.5">
                            <div>
                                <CardTitle>{t('sessions.current.title')}</CardTitle>
                                <CardDescription>{t('sessions.current.description')}</CardDescription>
                            </div>
                            <CardAction>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenCurrentDetails}
                                    disabled={!currentSession || currentSessionQuery.isPending}
                                >
                                    {t('sessions.actions.open_details')}
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {currentSessionQuery.isPending ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('common.loading')}
                                </p>
                            ) : !currentSession ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('sessions.current.empty')}
                                </p>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-lg font-semibold leading-tight break-words">
                                                {buildDisplayName(currentSession, fallbackDeviceLabel)}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {buildPlatform(currentSession) || fallbackDeviceLabel}
                                            </p>
                                        </div>
                                        <Badge variant={currentSession.revoked_at ? 'destructive' : 'secondary'}>
                                            {getStatusLabel(currentSession)}
                                        </Badge>
                                    </div>

                                    <dl className="grid gap-4 sm:grid-cols-2">
                                        {currentSessionDetails.slice(0, 4).map((item) => (
                                            <div key={item.key} className="space-y-1">
                                                <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                                                    {item.label}
                                                </dt>
                                                <dd className="text-sm font-medium break-words">{item.value}</dd>
                                            </div>
                                        ))}
                                    </dl>

                                    <div className="text-sm text-muted-foreground">
                                        {t('sessions.current.helper')}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="gap-1.5">
                            <div>
                                <CardTitle>{t('sessions.others.title')}</CardTitle>
                                <CardDescription>{t('sessions.others.description')}</CardDescription>
                            </div>
                            <CardAction>
                                <div className="flex flex-wrap items-center gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    otherSessionsQuery.isPending ||
                                                    revokeOthersMutation.isPending
                                                }
                                            >
                                                {t('sessions.actions.revoke_others')}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t('sessions.dialogs.revoke_others.title')}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('sessions.dialogs.revoke_others.description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    {t('common.cancel')}
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => revokeOthersMutation.mutate()}
                                                    disabled={revokeOthersMutation.isPending}
                                                >
                                                    {revokeOthersMutation.isPending ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <Loader2 className="size-4 animate-spin" />
                                                            {t('sessions.actions.revoke_in_progress')}
                                                        </span>
                                                    ) : (
                                                        t('sessions.actions.revoke_others_confirm')
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={
                                                    otherSessionsQuery.isPending ||
                                                    revokeAllMutation.isPending
                                                }
                                            >
                                                {t('sessions.actions.revoke_all')}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t('sessions.dialogs.revoke_all.title')}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('sessions.dialogs.revoke_all.description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    {t('common.cancel')}
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => revokeAllMutation.mutate()}
                                                    disabled={revokeAllMutation.isPending}
                                                >
                                                    {revokeAllMutation.isPending ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <Loader2 className="size-4 animate-spin" />
                                                            {t('sessions.actions.revoke_in_progress')}
                                                        </span>
                                                    ) : (
                                                        t('sessions.actions.revoke_all_confirm')
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            {otherSessionsQuery.isPending ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('common.loading')}
                                </p>
                            ) : otherSessions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('sessions.others.empty')}
                                </p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {otherSessions.map((session) => (
                                        <li key={session.session_id}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectSession(session)}
                                                className="w-full rounded-lg border bg-card px-4 py-3 text-start shadow-xs transition hover:border-primary/40 hover:bg-accent/50 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium leading-tight truncate">
                                                            {buildDisplayName(session, fallbackDeviceLabel)}
                                                        </p>
                                                        <p className="text-muted-foreground text-sm truncate">
                                                            {`${session.ip_address || t('sessions.value.not_available')} • ${formatDateTime(session.issued_at)}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={session.revoked_at ? 'destructive' : 'outline'}
                                                        >
                                                            {getStatusLabel(session)}
                                                        </Badge>
                                                        <ChevronRight className="size-4 text-muted-foreground shrink-0 rtl:-scale-x-100" />
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={detailsOpen} onOpenChange={handleDetailsOpenChange}>
                <SheetContent side={detailSheetSide} className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            {t('sessions.details.title')}
                        </SheetTitle>
                        <p className="text-muted-foreground text-sm">
                            {selectedSession
                                ? buildDisplayName(selectedSession, fallbackDeviceLabel)
                                : t('sessions.details.empty')}
                        </p>
                    </SheetHeader>

                    <ScrollArea className="px-4 pb-4">
                        <dl className="grid gap-4">
                            {selectedSessionDetails.map((item) => (
                                <div key={item.key} className="space-y-1">
                                    <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                                        {item.label}
                                    </dt>
                                    <dd className="text-sm break-words font-medium">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </ScrollArea>

                    <SheetFooter className="px-4 pb-4">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={() => handleDetailsOpenChange(false)}
                                className="sm:min-w-[140px]"
                            >
                                {t('sessions.actions.close')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleRevokeSelected}
                                disabled={!selectedSession || isRevokingSelected}
                                className="sm:min-w-[180px]"
                            >
                                {isRevokingSelected ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        {t('sessions.actions.revoke_selected_in_progress')}
                                    </span>
                                ) : selectedSession?.is_current ? (
                                    t('sessions.actions.revoke_current')
                                ) : (
                                    t('sessions.actions.revoke_selected')
                                )}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </DashboardLayout>
    )
}
