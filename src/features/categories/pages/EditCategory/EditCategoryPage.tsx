import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CategoryForm from '@/features/categories/components/layout/Form/CategoryForm'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/features/categories/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'
import { categoriesQueries } from '@/features/categories'
import ErrorFallback from '@/components/layout/ErrorFallback'

const FORM_ID = 'category-form'

export default function EditCategoryPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const detailQuery = categoriesQueries.useDetail(id!)
    const updateMutation = categoriesQueries.useUpdate()
    const deleteMutation = categoriesQueries.useDelete()
    const [apiErrors, setApiErrors] = React.useState<ReadonlyArray<{ field: string; message: string }>>([])

    const handleSubmit = (values: CreateCategoryRequest) => {
        if (!id) return
        setApiErrors([])
        const payload: UpdateCategoryRequest = values
        updateMutation.mutate({ id, payload }, {
            onSuccess: () => {
                toast.success(t('categories.saved_success'))
                navigate(ROUTES.CATEGORY.LIST)
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
        })
    }

    const handleDelete = () => {
        if (!id) return
        if (!window.confirm(t('categories.actions.delete_confirm') as string)) return
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success(t('categories.deleted'))
                navigate(ROUTES.CATEGORY.LIST)
            },
            onError: () => toast.error(t('common.error')),
        })
    }

    if (detailQuery.isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6">{t('common.loading')}</div>
            </DashboardLayout>
        )
    }
    if (detailQuery.isError || !detailQuery.data) {
        return (
            <DashboardLayout>
                <ErrorFallback error={detailQuery.error} onRetry={() => detailQuery.refetch()} />
            </DashboardLayout>
        )
    }

    const defaults: CreateCategoryRequest = {
        name: detailQuery.data.data.name,
        description: detailQuery.data.data.description || '',
        parent_id: detailQuery.data.data.parent_id || '',
        image_id: detailQuery.data.data.image_id || '',
    }

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                <div className="flex items-center justify-between">
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
                        <h1 className="text-2xl font-bold tracking-tight">{t('categories.edit')}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {t('categories.actions.delete')}
                        </Button>
                        <Button type="submit" form={FORM_ID} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>
                <CategoryForm
                    formId={FORM_ID}
                    onSubmit={handleSubmit}
                    submitting={updateMutation.isPending}
                    defaultValues={defaults}
                    apiErrors={apiErrors}
                    initialImageUrl={detailQuery.data.data.image_url}
                />
            </div>
        </DashboardLayout>
    )
}
