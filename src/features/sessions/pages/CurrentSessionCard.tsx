import { useQuery } from '@tanstack/react-query'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/shared/hooks/useI18n'
import { fetchCurrentSession } from '@/features/sessions/api'
import type { SessionRecord } from '@/features/sessions/model/types'

interface CurrentSessionCardProps {
    setSelectedSession: (session: SessionRecord | null) => void
    setDetailsOpen: (open: boolean) => void
}

export default function CurrentSessionCard({ setSelectedSession, setDetailsOpen }: CurrentSessionCardProps) {
    const { t } = useI18n()

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
    const fallbackDeviceLabel = t('sessions.value.not_available') as string

    return (
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
                    <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
                ) : !currentSession ? (
                    <p className="text-sm text-muted-foreground">{t('sessions.current.empty')}</p>
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
                            {mapSessionDetails(currentSession).slice(0, 4).map((item) => (
                                <div key={item.key} className="space-y-1">
                                    <dt className="text-muted-foreground text-xs uppercase tracking-wide">{item.label}</dt>
                                    <dd className="text-sm font-medium break-words">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="text-sm text-muted-foreground">{t('sessions.current.helper')}</div>
                    </div>
                )}
            </CardContent>
        </Card>
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

function getStatusLabel(session: SessionRecord) {
    const { t } = useI18n()
    if (session.revoked_at) {
        return t('sessions.status.revoked') as string
    }
    const status = session.status?.toLowerCase()
    const key = status ? `sessions.status.${status}` : 'sessions.status.unknown'
    const label = t(key)
    const value = typeof label === 'string' ? label : String(label)
    return value === key && status ? status : value
}

function mapSessionDetails(session: SessionRecord) {
    const { t, locale } = useI18n()
    const fallback = t('sessions.value.not_available') as string
    const formatDateTime = (value?: string | null) => {
        if (!value) return fallback
        const timestamp = Date.parse(value)
        if (Number.isNaN(timestamp)) return fallback
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
    return [
        { key: 'session_id', label: t('sessions.fields.session_id') as string, value: session.session_id || fallback },
        { key: 'status', label: t('sessions.fields.status') as string, value: getStatusLabel(session) },
        { key: 'ip_address', label: t('sessions.fields.ip_address') as string, value: session.ip_address || fallback },
        { key: 'app_context', label: t('sessions.fields.app_context') as string, value: session.app_context || fallback },
    ]
}