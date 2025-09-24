import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';



import { useCallback } from 'react';



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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth';
import { fetchOtherSessions, revokeOtherSessions } from '@/features/sessions/api';
import type { SessionRecord } from '@/features/sessions/model/types';
import { useI18n } from '@/shared/hooks/useI18n';
import { isRTLLocale } from '@/shared/i18n/utils';





interface OtherSessionsCardProps {
    setSelectedSession: (session: SessionRecord | null) => void
    setDetailsOpen: (open: boolean) => void
}

export default function OtherSessionsCard({ setSelectedSession, setDetailsOpen }: OtherSessionsCardProps) {
    const { t } = useI18n()
    const isRTL = isRTLLocale(t('locale') as string)

    const otherSessionsQuery = useQuery({
        queryKey: ['sessions', 'others'],
        queryFn: ({ signal }) => fetchOtherSessions({ signal }),
    })

    const revokeOthersMutation = useMutation({
        mutationFn: () => revokeOtherSessions(),
        onSuccess: async () => {
            toast.success(t('sessions.toasts.revoked_others') as string)
            setDetailsOpen(false)
            setSelectedSession(null)
        },
    })

    const handleSelectSession = useCallback((session: SessionRecord) => {
        setSelectedSession(session)
        setDetailsOpen(true)
    }, [setSelectedSession, setDetailsOpen])

    const otherSessions = otherSessionsQuery.data ?? []
    const fallbackDeviceLabel = t('sessions.value.not_available') as string

    return (
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
                                    disabled={otherSessionsQuery.isPending || revokeOthersMutation.isPending}
                                >
                                    {t('sessions.actions.revoke_others')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('sessions.dialogs.revoke_others.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('sessions.dialogs.revoke_others.description')}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
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
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent>
                {otherSessionsQuery.isPending ? (
                    <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
                ) : otherSessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('sessions.others.empty')}</p>
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
                                            <Badge variant={session.revoked_at ? 'destructive' : 'outline'}>
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
    )
}

function buildDisplayName(session: SessionRecord, fallback: string) {
    const primary = session.browser_name || session.platform || session.app_context
    return primary || fallback
}

function formatDateTime(value?: string | null) {
    const { t, locale } = useI18n()
    if (!value) return t('sessions.value.not_available') as string
    const timestamp = Date.parse(value)
    if (Number.isNaN(timestamp)) return t('sessions.value.not_available') as string
    const date = new Date(timestamp)
    try {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date)
    } catch {
        return date.toLocaleString()
    }
}

function getStatusLabel(session: SessionRecord) {
    const { t } = useI18n()
    if (session.revoked_at) return t('sessions.status.revoked') as string
    const status = session.status?.toLowerCase()
    const key = status ? `sessions.status.${status}` : 'sessions.status.unknown'
    const label = t(key)
    const value = typeof label === 'string' ? label : String(label)
    return value === key && status ? status : value
}