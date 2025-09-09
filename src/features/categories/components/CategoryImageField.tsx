import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import CategoryImageUploader from '@/features/categories/components/CategoryImageUploader.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { CreateCategoryRequest } from '@/features/categories/model/types.ts'

type Props = Readonly<{
    initialImageUrl?: string | null
}>

export default function CategoryImageField({ initialImageUrl }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<CreateCategoryRequest>()
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState(initialImageUrl || '')

    React.useEffect(() => {
        setImagePreviewUrl(initialImageUrl || '')
    }, [initialImageUrl])

    return (
        <div className="flex flex-col">
            <CategoryImageUploader
                value={imagePreviewUrl || ''}
                onChange={(file) => {
                    const id = file?.id || ''
                    const url = file?.url || ''
                    setImagePreviewUrl(url)
                    setValue('image_id', id, { shouldDirty: true })
                }}
                label={t('categories.form.image')}
                aspect="square"
                className="h-56 w-full self-start"
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('categories.form.image_help')}
            </p>
        </div>
    )
}
