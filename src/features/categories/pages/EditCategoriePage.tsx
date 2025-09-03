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

import CategorieForm from '../components/CategorieForm'
import type { CategorieData, CreateCategorieRequest } from '../model/types'
import { categoriesQueries } from '@/features/categories'

function categorieToFormDefaults(e?: CategorieData): Partial<CreateCategorieRequest> {
    if (!e) return {}
    return {
    name: e.name ?? '',
    description: e.description ?? '',
    // ⚠️ فیلدهای اضافی را بر اساس swagger اضافه کن
    }
    }

    export default function EditCategoriePage(): JSX.Element {
    const { id: rawId } = useParams()
    const id = (rawId || '').trim()
    const navigate = useNavigate()

    const { data, isLoading, error } = categoriesQueries.useDetail(id)
    const update = categoriesQueries.useUpdate()
    const del = categoriesQueries.useDelete()

    const { t, locale } = useI18n()
    const rtl = (locale?.toLowerCase?.() ?? '').startsWith('fa')

    const [apiErrors, setApiErrors] = React.useState<
    ReadonlyArray<{ field: string; message: string }>
    >([])

    React.useEffect(() => {
    if (isLoading) {
    defaultLogger.info('Loading categorie...', { id })
    return
    }
    if (error) {
    defaultLogger.error('Failed to load categorie', { id, error: error.message })
    return
    }
    if (data?.data) {
    defaultLogger.info('Categorie loaded', {
    id: data.data.id,
    name: data.data.name,
    })
    }
    }, [data, isLoading, error, id])

    const formDefaults = React.useMemo(
    () => categorieToFormDefaults(data?.data),
    [data],
    )

    const handleDelete = React.useCallback(() => {
    if (!id) return
    if (!window.confirm(t('categorie.actions.delete'))) return

    del.mutate(id, {
    onSuccess: () => {
    toast.success(t('categorie.deleted'))
    navigate(ROUTES.CATEGORIE.LIST)
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
                    <h1 className="text-2xl font-bold">{t('categorie.edit') ?? t('actions.edit')}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="submit" form="categorie-form" disabled={update.isPending}>
                        {update.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        {t('categorie.actions.delete')}
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading || !data ? (
            <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
            ) : (
            <CategorieForm
                key={data.data.id}
                defaultValues={formDefaults}
            // ⚠️ اگر entity فیلد media دارد، initial props اینجا اضافه شود
            onSubmit={(values) => {
            setApiErrors([])
            update.mutate(
            { id, payload: values },
            {
            onSuccess: () => {
            toast.success(t('categorie.saved_success') ?? t('common.success'))
            navigate(ROUTES.CATEGORIE.LIST)
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
