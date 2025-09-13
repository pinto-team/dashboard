import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import ProductImageUploader from '@/features/products/components/layout/Uploader/ProductImageUploader'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CreateProductRequest } from '@/features/products/model/types'
import { toAbsoluteUrl } from '@/shared/api/files'

type Props = Readonly<{ initialImageUrl?: string | null }>

export default function ProductImageField({ initialImageUrl }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<CreateProductRequest>()
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('')

    React.useEffect(() => {
        setImagePreviewUrl(initialImageUrl ? toAbsoluteUrl(initialImageUrl) : '')
    }, [initialImageUrl])

    return (
        <div className="flex flex-col">
            <ProductImageUploader
                value={imagePreviewUrl ? imagePreviewUrl : null}
                onChange={(file) => {
                    const id = file?.id || ''
                    const url = file?.url ? toAbsoluteUrl(file.url) : ''
                    setImagePreviewUrl(url)
                    setValue('primary_image_id', id, { shouldDirty: true })
                }}
                label={t('products.form.image')}
                aspect="square"
                className="h-56 w-full self-start"
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('products.form.image_help')}
            </p>
        </div>
    )
}
