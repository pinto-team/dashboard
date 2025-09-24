import { useQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchCurrentSession } from '@/features/sessions/api'
import type { SessionRecord } from '@/features/sessions/model/types'
import { useSessionFormatter } from '@/features/sessions/hooks/useSessionFormatter'
import { useI18n } from '@/shared/hooks/useI18n'

interface CurrentSessionCardProps {
    setSelectedSession: (session: SessionRecord | null) => void
    setDetailsOpen: (open: boolean) => void
}

export default function CurrentSessionCard({ setSelectedSession, setDetailsOpen }: CurrentSessionCardProps) {
    const { t } = useI18n()
    const { buildDisplayName, buildPlatform, getStatusLabel, getSummaryDetails, fallbackLabel } = useSessionFormatter()

    const currentSessionQuery = useQuery({
        queryKey: ['sessions', 'current'],
        queryFn: ({ signal }) => fetchCurrentSession({ signal }),
    })

    const handleOpenCurrentDetails = () => {
        if (!currentSessionQuery.data) return
        const sessionWithFlag: SessionRecord = {
            ...currentSessionQuery.data,
            is_current: true,
        }
        setSelectedSession(sessionWithFlag)
        setDetailsOpen(true)
    }

    const currentSession = currentSessionQuery.data
    const summaryDetails = currentSession ? getSummaryDetails(currentSession) : []

    return (
        <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="gap-3 pb-0">
                <div>
                    <CardTitle className="text-base font-semibold sm:text-lg">
                        {t('sessions.current.title')}
                    </CardTitle>
                    <CardDescription className="text-sm">
                        {t('sessions.current.description')}
                    </CardDescription>
                </div>
                <CardAction>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-dashed"
                        onClick={handleOpenCurrentDetails}
                        disabled={!currentSession || currentSessionQuery.isPending}
                    >
                        {t('sessions.actions.open_details')}
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
                {currentSessionQuery.isPending ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                        {t('common.loading')}
                    </div>
                ) : !currentSession ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                        {t('sessions.current.empty')}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 space-y-1">
                                <p className="text-lg font-semibold leading-tight sm:text-xl">
                                    {buildDisplayName(currentSession)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {buildPlatform(currentSession) || fallbackLabel}
                                </p>
                            </div>
                            <Badge
                                variant={currentSession.revoked_at ? 'destructive' : 'secondary'}
                                className="rounded-full px-3 py-1 text-xs font-medium"
                            >
                                {getStatusLabel(currentSession)}
                            </Badge>
                        </div>
                        {summaryDetails.length > 0 && (
                            <dl className="grid gap-3 sm:grid-cols-3">
                                {summaryDetails.map((item) => (
                                    <div
                                        key={item.key}
                                        className="rounded-lg border border-border/60 bg-muted/30 p-3"
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
                        )}
                        <p className="text-sm text-muted-foreground">
                            {t('sessions.current.helper')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
