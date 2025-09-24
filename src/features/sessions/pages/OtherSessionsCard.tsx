import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCallback } from 'react'

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
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchOtherSessions, revokeOtherSessions } from '@/features/sessions/api'
import type { SessionRecord } from '@/features/sessions/model/types'
import { useSessionFormatter } from '@/features/sessions/hooks/useSessionFormatter'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'

interface OtherSessionsCardProps {
    setSelectedSession: (session: SessionRecord | null) => void
    setDetailsOpen: (open: boolean) => void
}

export default function OtherSessionsCard({ setSelectedSession, setDetailsOpen }: OtherSessionsCardProps) {
    const { t } = useI18n()
    const isRTL = isRTLLocale(t('locale') as string)
    const { buildDisplayName, formatDateTime, getStatusLabel, fallbackLabel } = useSessionFormatter()

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

    const handleSelectSession = useCallback(
        (session: SessionRecord) => {
            setSelectedSession(session)
            setDetailsOpen(true)
        },
        [setDetailsOpen, setSelectedSession],
    )

    const otherSessions = otherSessionsQuery.data ?? []

    return (
        <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="gap-3 pb-0">
                <div>
                    <CardTitle className="text-base font-semibold sm:text-lg">
                        {t('sessions.others.title')}
                    </CardTitle>
                    <CardDescription className="text-sm">
                        {t('sessions.others.description')}
                    </CardDescription>
                </div>
                <CardAction>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-dashed"
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
                </CardAction>
            </CardHeader>
            <CardContent className="pt-5">
                {otherSessionsQuery.isPending ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                        {t('common.loading')}
                    </div>
                ) : otherSessions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                        {t('sessions.others.empty')}
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {otherSessions.map((session) => (
                            <li key={session.session_id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectSession(session)}
                                    className="group w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-start shadow-xs transition hover:border-primary/50 hover:bg-accent/40 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="truncate text-sm font-semibold leading-tight text-foreground sm:text-base">
                                                {buildDisplayName(session)}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground sm:text-sm">
                                                {`${session.ip_address || fallbackLabel} • ${formatDateTime(session.issued_at)}`}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={session.revoked_at ? 'destructive' : 'outline'}
                                            className="rounded-full px-3 py-1 text-xs font-medium"
                                        >
                                            {getStatusLabel(session)}
                                        </Badge>
                                        <ChevronRight className={`size-4 text-muted-foreground transition group-hover:translate-x-0.5 ${isRTL ? 'rtl:-scale-x-100' : ''}`} />
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
