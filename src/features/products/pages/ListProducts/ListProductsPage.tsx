import * as React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/app/routes/routes'
import { useI18n } from '@/shared/hooks/useI18n'

export default function ListProductsPage() {
    const { t } = useI18n()
    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('products.title')}</h1>
                    <Button asChild>
                        <Link to={ROUTES.PRODUCT.NEW}>{t('products.create')}</Link>
                    </Button>
                </div>
                {/* Product list will be implemented here */}
            </div>
        </DashboardLayout>
    )
}
