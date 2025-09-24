import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCallback, useMemo, useState } from 'react'

import DashboardLayout from '@/components/layout/DashboardLayout'
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
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { revokeAllSessions, revokeCurrentSession, revokeSessionById } from '@/features/sessions/api'
import { useSessionFormatter } from '@/features/sessions/hooks/useSessionFormatter'
import type { SessionRecord } from '@/features/sessions/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'

import CurrentSessionCard from './CurrentSessionCard'
import OtherSessionsCard from './OtherSessionsCard'

export default function SessionsPage() {
    const { t, locale } = useI18n()
    const { buildDisplayName, getDetailGroups } = useSessionFormatter()
    const { logout } = useAuth()
    const isRTL = isRTLLocale(locale)
    const queryClient = useQueryClient()

    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null)

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

    const selectedSessionDetailGroups = useMemo(
        () => (selectedSession ? getDetailGroups(selectedSession) : []),
        [getDetailGroups, selectedSession],
    )

    const handleDetailsOpenChange = useCallback((open: boolean) => {
        setDetailsOpen(open)
        if (!open) {
            setSelectedSession(null)
        }
    }, [])

    const detailSheetSide = isRTL ? 'left' : 'right'

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('sessions.title')}</h1>
                            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                {t('sessions.description')}
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="sm:w-auto"
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
                </div>
                <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-6">
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
                <SheetContent side={detailSheetSide} className="w-full gap-0 p-0 sm:max-w-md">
                    <SheetHeader className="gap-1.5 border-b p-6">
                        <SheetTitle className="text-lg font-semibold">{t('sessions.details.title')}</SheetTitle>
                        <p className="text-sm text-muted-foreground">
                            {selectedSession
                                ? buildDisplayName(selectedSession)
                                : t('sessions.details.empty')}
                        </p>
                    </SheetHeader>
                    <ScrollArea className="flex-1 px-6 py-5">
                        {selectedSession ? (
                            <div className="space-y-6">
                                {selectedSessionDetailGroups.map((group) => (
                                    <section key={group.key} className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                {group.title}
                                            </h3>
                                            <span className="h-px flex-1 bg-border/70" />
                                        </div>
                                        <dl className="grid gap-3 sm:grid-cols-2">
                                            {group.items.map((item) => (
                                                <div
                                                    key={item.key}
                                                    className="rounded-lg border border-border/60 bg-muted/40 p-3"
                                                >
                                                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        {item.label}
                                                    </dt>
                                                    <dd className="mt-1 break-words text-sm font-semibold leading-snug text-foreground">
                                                        {item.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
                                {t('sessions.details.empty')}
                            </div>
                        )}
                    </ScrollArea>
                    <SheetFooter className="border-t bg-muted/40 px-6 py-4">
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
