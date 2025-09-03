import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'
import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import BrandForm from '@/features/brands/components/BrandForm'
import type { CreateBrandRequest } from '@/features/brands/model/types'
import { AppSidebar } from '@/features/sidebar/app-sidebar'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'
import { brandsQueries } from '@/features/brands'

const FORM_ID = 'brand-form'

export default function AddBrandPage(): JSX.Element {
const navigate = useNavigate()
const { t, locale } = useI18n()
const rtl = isRTLLocale(locale)

// mutation (envelope-aware: returns BrandData)
const createMutation = brandsQueries.useCreate()

// field-level API errors (422)
const [apiErrors, setApiErrors] = React.useState<
ReadonlyArray<{ field: string; message: string }>
>([])

function handleSubmit(values: CreateBrandRequest) {
setApiErrors([])

createMutation.mutate(values, {
onSuccess: () => {
toast.success(t('brand.saved_success') ?? 'Brand saved successfully')
navigate(ROUTES.BRAND.NEW)
},
onError: (err) => {
const resp = (err as { response?: { data?: unknown } }).response?.data as
| { code?: number; errors?: Array<{ field: string; message: string }> }
| undefined

if (resp?.code === 422 && Array.isArray(resp.errors)) {
setApiErrors(resp.errors)
} else {
toast.error(t('common.error') ?? 'Something went wrong')
}
},
})
}

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
    <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    className="shadow-none"
                    onClick={() => navigate(-1)}
                aria-label={t('common.back') ?? 'Back'}
                title={t('common.back') ?? 'Back'}
                >
                {rtl ? (
                <ArrowRight className="h-4 w-4" />
                ) : (
                <ArrowLeft className="h-4 w-4" />
                )}
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {t('brand.add') ?? 'Add Brand'}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <Button type="submit" form={FORM_ID} disabled={createMutation.isPending}>
                    {createMutation.isPending
                    ? t('common.saving') ?? 'Saving...'
                    : t('common.save') ?? 'Save'}
                </Button>
            </div>
        </div>

        {/* Form */}
        <BrandForm
            formId={FORM_ID}
            onSubmit={handleSubmit}
            submitting={createMutation.isPending}
            apiErrors={apiErrors}
        />
    </div>
</SidebarInset>
</SidebarProvider>
)
}
