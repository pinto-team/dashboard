import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import CategoryImageUploader from '@/features/categories/components/CategoryImageUploader.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { CreateCategoryRequest } from '@/features/categories/model/types.ts'
// اضافه:
import { toAbsoluteUrl } from '@/shared/api/files'

type Props = Readonly<{ initialImageUrl?: string | null }>

export default function CategoryImageField({ initialImageUrl }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<CreateCategoryRequest>()
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('')

    React.useEffect(() => {
        // اگر URL موجود است، مطلق کن؛ اگر نه، خالی بگذار
        setImagePreviewUrl(initialImageUrl ? toAbsoluteUrl(initialImageUrl) : '')
    }, [initialImageUrl])

    return (
        <div className="flex flex-col">
            <CategoryImageUploader
                // نکتهٔ مهم: اگر خالی است، null بده؛ نه رشتهٔ خالی.
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
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('categories.form.image_help')}
            </p>
        </div>
    )
}
