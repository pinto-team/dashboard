import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import BrandLogoUploader from '@/features/brands/components/layout/Uploader/BrandLogoUploader.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { BrandFormValues } from '@/features/brands/model/types.ts'

type Props = Readonly<{
    initialLogoUrl?: string | null
}>

export default function BrandLogoField({ initialLogoUrl }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<BrandFormValues>()
    const [logoPreviewUrl, setLogoPreviewUrl] = React.useState(initialLogoUrl || '')

    React.useEffect(() => {
        setLogoPreviewUrl(initialLogoUrl || '')
    }, [initialLogoUrl])

    return (
        <div className="flex flex-col">
            <BrandLogoUploader
                value={logoPreviewUrl || ''}
                onChange={(file) => {
                    const id = file?.id || ''
                    const url = file?.url || ''
                    setLogoPreviewUrl(url)
                    setValue('logo_id', id, { shouldDirty: true })
                }}
                label={t('brands.form.logo')}
                aspect="square"
                className="h-56 w-full self-start"
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('brands.form.logo_help')}
            </p>
        </div>
    )
}
