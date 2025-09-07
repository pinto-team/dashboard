import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'
import { categoriesQueries } from '@/features/categories'
import ErrorFallback from '@/components/layout/ErrorFallback'
import { ROUTES } from '@/app/routes/routes'

export default function DetailCategoryPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const detailQuery = categoriesQueries.useDetail(id!)

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

    const c = detailQuery.data.data

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
                        <h1 className="text-2xl font-bold tracking-tight">{c.name}</h1>
                    </div>
                    <Button onClick={() => navigate(ROUTES.CATEGORY.EDIT(c.id))}>
                        <Pencil className="mr-2 h-4 w-4" /> {t('categories.actions.edit')}
                    </Button>
                </div>
                <div className="grid gap-2">
                    <div>
                        <span className="font-semibold">{t('categories.form.description')}: </span>
                        <span>{c.description || '-'}</span>
                    </div>
                    <div>
                        <span className="font-semibold">{t('categories.form.parent_id')}: </span>
                        <span>{c.parent_id || '-'}</span>
                    </div>
                    <div>
                        <span className="font-semibold">{t('categories.form.image_url')}: </span>
                        {c.image_url ? (
                            <a
                                href={c.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                {c.image_url}
                            </a>
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
