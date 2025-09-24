import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';



import { useCallback, useMemo, useState } from 'react';



import DashboardLayout from '@/components/layout/DashboardLayout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { revokeAllSessions, revokeCurrentSession, revokeSessionById } from '@/features/sessions/api';
import type { SessionRecord } from '@/features/sessions/model/types';
import { useI18n } from '@/shared/hooks/useI18n';
import { isRTLLocale } from '@/shared/i18n/utils';



import CurrentSessionCard from './CurrentSessionCard';
import OtherSessionsCard from './OtherSessionsCard';





type DetailItem = {
    key: string
    label: string
    value: string
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
            } catch {
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
            return value === key && status ? status : value
        },
        [t],
    )

    const mapSessionDetails = useCallback(
        (session: SessionRecord): DetailItem[] => {
            const fallback = t('sessions.value.not_available') as string
            return [
                { key: 'session_id', label: t('sessions.fields.session_id') as string, value: session.session_id || fallback },
                { key: 'status', label: t('sessions.fields.status') as string, value: getStatusLabel(session) },
                { key: 'ip_address', label: t('sessions.fields.ip_address') as string, value: session.ip_address || fallback },
                { key: 'app_context', label: t('sessions.fields.app_context') as string, value: session.app_context || fallback },
                { key: 'locale', label: t('sessions.fields.locale') as string, value: session.locale || fallback },
                { key: 'platform', label: t('sessions.fields.platform') as string, value: buildPlatform(session) || fallback },
                { key: 'browser', label: t('sessions.fields.browser') as string, value: buildBrowser(session) || fallback },
                { key: 'device_id', label: t('sessions.fields.device_id') as string, value: session.device_id || fallback },
                { key: 'user_agent', label: t('sessions.fields.user_agent') as string, value: session.user_agent || fallback },
                { key: 'app_version', label: t('sessions.fields.app_version') as string, value: session.app_version || fallback },
                { key: 'issued_at', label: t('sessions.fields.issued_at') as string, value: formatDateTime(session.issued_at) },
                { key: 'expires_at', label: t('sessions.fields.expires_at') as string, value: formatDateTime(session.expires_at) },
                { key: 'revoked_at', label: t('sessions.fields.revoked_at') as string, value: session.revoked_at ? formatDateTime(session.revoked_at) : fallback },
            ]
        },
        [formatDateTime, getStatusLabel, t],
    )

    const invalidateSessions = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['sessions'], exact: false })
    }, [queryClient])

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

    const isRevokingSelected = revokeSessionMutation.isPending || revokeCurrentMutation.isPending

    const handleRevokeSelected = useCallback(async () => {
        if (!selectedSession) return
        if (selectedSession.is_current) {
            await revokeCurrentMutation.mutateAsync()
            return
        }
        await revokeSessionMutation.mutateAsync(selectedSession.session_id)
    }, [revokeCurrentMutation, revokeSessionMutation, selectedSession])

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

    const detailSheetSide = isRTL ? 'left' : 'right'
    const fallbackDeviceLabel = t('sessions.value.not_available') as string

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-6 py-4 md:py-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="px-4 lg:px-6 flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight">{t('sessions.title')}</h1>
                        <p className="text-muted-foreground text-sm">{t('sessions.description')}</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={revokeAllMutation.isPending}
                            >
                                {t('sessions.actions.revoke_all')}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('sessions.dialogs.revoke_all.title')}</AlertDialogTitle>
                                <AlertDialogDescription>{t('sessions.dialogs.revoke_all.description')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
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
                <div className="px-4 lg:px-6 space-y-6">
                    <CurrentSessionCard
                        setSelectedSession={setSelectedSession}
                        setDetailsOpen={setDetailsOpen}
                    />
                    <OtherSessionsCard
                        setSelectedSession={setSelectedSession}
                        setDetailsOpen={setDetailsOpen}
                    />
                </div>
            </div>
            <Sheet open={detailsOpen} onOpenChange={handleDetailsOpenChange}>
                <SheetContent side={detailSheetSide} className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">{t('sessions.details.title')}</SheetTitle>
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
                                    <dt className="text-muted-foreground text-xs uppercase tracking-wide">{item.label}</dt>
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

function buildDisplayName(session: SessionRecord, fallback: string) {
    const primary = session.browser_name || session.platform || session.app_context
    return primary || fallback
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