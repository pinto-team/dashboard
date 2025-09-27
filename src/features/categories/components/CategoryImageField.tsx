import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import CategoryImageUploader from '@/features/categories/components/CategoryImageUploader.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { CategoryFormValues } from '@/features/categories/model/types.ts'
import { toAbsoluteUrl } from '@/shared/api/files'

type Props = Readonly<{ initialImageUrl?: string | null; submitting?: boolean }>

export default function CategoryImageField({ initialImageUrl, submitting = false }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<CategoryFormValues>()
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('')

    React.useEffect(() => {
        setImagePreviewUrl(initialImageUrl ? toAbsoluteUrl(initialImageUrl) : '')
    }, [initialImageUrl])

    return (
        <div className="flex flex-col">
            <CategoryImageUploader
                value={imagePreviewUrl ? imagePreviewUrl : null}
                onChange={(file) => {
                    const id = file?.id || ''
                    const url = file?.url ? toAbsoluteUrl(file.url) : ''
                    setImagePreviewUrl(url)
                    setValue('image_id', id, { shouldDirty: true })
                }}
                label={t('categories.form.image')}
                aspect="square"
                className="h-56 w-full self-start"
                disabled={submitting}
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('categories.form.image_help')}
            </p>
        </div>
    )
}
