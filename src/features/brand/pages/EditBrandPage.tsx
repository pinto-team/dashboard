// features/brand/pages/EditBrandPage.tsx
import {ArrowLeft, ArrowRight} from 'lucide-react'
import {toast} from 'sonner'
import * as React from 'react'
import {JSX} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {ROUTES} from '@/app/routes/routes'
import {SiteHeader} from '@/components/layout/site-header'
import {Button} from '@/components/ui/button'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import {AppSidebar} from '@/features/sidebar/app-sidebar'
import {useI18n} from '@/shared/hooks/useI18n'
import {defaultLogger} from '@/shared/lib/logger'

import BrandForm from '../components/BrandForm'
import type {BrandData, CreateBrandRequest} from '../model/types'
import {brandsQueries} from '@/features/brand'
import {toAbsoluteUrl} from "@/shared/api/files.ts";

function brandToFormDefaults(b?: BrandData): Partial<CreateBrandRequest> {
    if (!b) return {}
    return {
        name: b.name ?? '',
        description: b.description ?? '',
        country: b.country ?? '',
        website: b.website ?? '',
        logo_id: b.logo_id ?? ''
    }
}

export default function EditBrandPage(): JSX.Element {
    const {id: rawId} = useParams()
    const id = (rawId || '').trim()
    const navigate = useNavigate()

    const {data, isLoading, error} = brandsQueries.useDetail(id)
    const update = brandsQueries.useUpdate()
    const del = brandsQueries.useDelete()

    const {t, locale} = useI18n()
    const rtl = (locale?.toLowerCase?.() ?? '').startsWith('fa')

    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])

    React.useEffect(() => {
        if (isLoading) {
            defaultLogger.info('Loading brand...', {id})
            return
        }
        if (error) {
            defaultLogger.error('Failed to load brand', {id, error: error.message})
            return
        }
        if (data?.data) {
            defaultLogger.info('Brand loaded', {id: data.data.id, name: data.data.name})
            console.log('Brand name:', data.data.name)
        }
    }, [data, isLoading, error, id])

    const formDefaults = React.useMemo(() => brandToFormDefaults(data?.data), [data])

    const handleDelete = React.useCallback(() => {
        if (!id) return
        // کلید نبود: brand.confirm_delete → از یک کلید موجود استفاده می‌کنیم
        if (!window.confirm(t('brand.actions.delete'))) return

        del.mutate(id, {
            onSuccess: () => {
                toast.success(t('brand.deleted')) // موجود است
                navigate(ROUTES.Brand.LIST)
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
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
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
                                {rtl ? <ArrowRight className="h-4 w-4"/> : <ArrowLeft className="h-4 w-4"/>}
                            </Button>
                            {/* کلید نبود: brand.edit → از actions.edit استفاده می‌کنیم */}
                            <h1 className="text-2xl font-bold">{t('actions.edit')}</h1>
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
                            initialLogoUrl={toAbsoluteUrl(data.data.logo_url ?? '')}
                            onSubmit={(values) => {
                                setApiErrors([])
                                update.mutate(
                                    {id, payload: values},
                                    {
                                        onSuccess: () => {
                                            // کلید نبود: brand.saved_success → common.success
                                            toast.success(t('common.success'))
                                            navigate(ROUTES.Brand.LIST)
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
                                    }
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
