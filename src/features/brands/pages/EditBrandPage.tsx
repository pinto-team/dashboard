import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'
import { JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/sidebar/app-sidebar'
import { useI18n } from '@/shared/hooks/useI18n'
import { defaultLogger } from '@/shared/lib/logger'

import BrandForm from '../components/BrandForm'
import type { BrandData, CreateBrandRequest } from '../model/types'
import { brandsQueries } from '@/features/brands'

function brandToFormDefaults(e?: BrandData): Partial<CreateBrandRequest> {
    if (!e) return {}
    return {
    name: e.name ?? '',
    description: e.description ?? '',
    // ⚠️ فیلدهای اضافی را بر اساس swagger اضافه کن
    }
    }

    export default function EditBrandPage(): JSX.Element {
    const { id: rawId } = useParams()
    const id = (rawId || '').trim()
    const navigate = useNavigate()

    const { data, isLoading, error } = brandsQueries.useDetail(id)
    const update = brandsQueries.useUpdate()
    const del = brandsQueries.useDelete()

    const { t, locale } = useI18n()
    const rtl = (locale?.toLowerCase?.() ?? '').startsWith('fa')

    const [apiErrors, setApiErrors] = React.useState<
    ReadonlyArray<{ field: string; message: string }>
    >([])

    React.useEffect(() => {
    if (isLoading) {
    defaultLogger.info('Loading brand...', { id })
    return
    }
    if (error) {
    defaultLogger.error('Failed to load brand', { id, error: error.message })
    return
    }
    if (data?.data) {
    defaultLogger.info('Brand loaded', {
    id: data.data.id,
    name: data.data.name,
    })
    }
    }, [data, isLoading, error, id])

    const formDefaults = React.useMemo(
    () => brandToFormDefaults(data?.data),
    [data],
    )

    const handleDelete = React.useCallback(() => {
    if (!id) return
    if (!window.confirm(t('brand.actions.delete'))) return

    del.mutate(id, {
    onSuccess: () => {
    toast.success(t('brand.deleted'))
    navigate(ROUTES.BRAND.LIST)
    },
    onError: () => toast.error(t('common.error')),
    })
    }, [del, id, navigate, t])

    return (
    <SidebarProvider
        style={
        {
    '--sidebar-width': 'calc(var(--spacing)*72)',
    '--header-height': 'calc(var(--spacing)*12)',
    } as React.CSSProperties
    }
    >
    <AppSidebar variant="inset" />
    <SidebarInset>
        <SiteHeader />
        <div className="flex-1 p-6 md:p-8 lg:p-10">
            {/* Header actions */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        className="shadow-none"
                        onClick={() => navigate(-1)}
                    aria-label={t('common.back')}
                    title={t('common.back')}
                    >
                    {rtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    </Button>
                    <h1 className="text-2xl font-bold">{t('brand.edit') ?? t('actions.edit')}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="submit" form="brand-form" disabled={update.isPending}>
                        {update.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        {t('brand.actions.delete')}
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading || !data ? (
            <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
            ) : (
            <BrandForm
                key={data.data.id}
                defaultValues={formDefaults}
            // ⚠️ اگر entity فیلد media دارد، initial props اینجا اضافه شود
            onSubmit={(values) => {
            setApiErrors([])
            update.mutate(
            { id, payload: values },
            {
            onSuccess: () => {
            toast.success(t('brand.saved_success') ?? t('common.success'))
            navigate(ROUTES.BRAND.LIST)
            },
            onError: (err) => {
            const resp = (err as { response?: { data?: unknown } }).response?.data as
            | { code?: number; errors?: Array<{ field: string; message: string }> }
            | undefined
            if (resp?.code === 422 && Array.isArray(resp.errors)) {
            setApiErrors(resp.errors)
            } else {
            toast.error(t('common.error'))
            }
            },
            },
            )
            }}
            submitting={update.isPending}
            apiErrors={apiErrors}
            />
            )}
        </div>
    </SidebarInset>
    </SidebarProvider>
    )
    }
