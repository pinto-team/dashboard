import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'
import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProductForm from '@/features/products/components/layout/Form/ProductForm'
import type { CreateProductRequest } from '@/features/products/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'
import { productsQueries } from '@/features/products'

const FORM_ID = 'product-form'

export default function AddProductPage(): JSX.Element {
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const createMutation = productsQueries.useCreate()
    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])

    function handleSubmit(values: CreateProductRequest) {
        setApiErrors([])

        createMutation.mutate(values, {
            onSuccess: () => {
                toast.success(t('products.saved_success'))
                navigate(ROUTES.PRODUCT.LIST)
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
                            {rtl ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <ArrowLeft className="h-4 w-4" />
                            )}
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('products.add')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" form={FORM_ID} disabled={createMutation.isPending}>
                            {createMutation.isPending ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>

                <ProductForm
                    formId={FORM_ID}
                    onSubmit={handleSubmit}
                    submitting={createMutation.isPending}
                    apiErrors={apiErrors}
                />
            </div>
        </DashboardLayout>
    )
}
