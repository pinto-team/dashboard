import * as React from 'react'
import { X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CreateProductRequest } from '@/features/products/model/types'
import ProductImageUploader from '@/features/products/components/layout/Uploader/ProductImageUploader'
import { toAbsoluteUrl } from '@/shared/api/files'

type ImageInfo = { id: string; url: string }

type Props = Readonly<{
    initialImages?: ReadonlyArray<ImageInfo>
}>

export default function ProductImagesField({ initialImages }: Props) {
    const { t } = useI18n()
    const { setValue } = useFormContext<CreateProductRequest>()
    const [images, setImages] = React.useState<ImageInfo[]>(
        initialImages
            ? initialImages.map((img) => ({ id: img.id, url: toAbsoluteUrl(img.url) }))
            : [],
    )
    const [uploadKey, setUploadKey] = React.useState(0)

    React.useEffect(() => {
        const imgs = initialImages
            ? initialImages.map((img) => ({ id: img.id, url: toAbsoluteUrl(img.url) }))
            : []
        setImages(imgs)
        setValue('image_ids', imgs.map((img) => img.id), { shouldDirty: false })
    }, [initialImages, setValue])

    const addImage = React.useCallback(
        (file: { id?: string | null; url?: string | null } | null) => {
            if (!file?.id || !file.url) return
            const newImages = [...images, { id: file.id, url: toAbsoluteUrl(file.url) }]
            setImages(newImages)
            setValue('image_ids', newImages.map((img) => img.id), { shouldDirty: true })
            setUploadKey((k) => k + 1)
        },
        [images, setValue],
    )

    const removeImage = React.useCallback(
        (index: number) => {
            const newImages = images.filter((_, i) => i !== index)
            setImages(newImages)
            setValue('image_ids', newImages.map((img) => img.id), { shouldDirty: true })
        },
        [images, setValue],
    )

    return (
        <div className="grid gap-2">
            <Label>{t('products.form.images')}</Label>
            <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                    <div key={img.id} className="relative h-24 w-24">
                        <img
                            src={img.url}
                            alt={t('products.image_alt') as string}
                            className="h-24 w-24 rounded-md border object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeImage(idx)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
                <ProductImageUploader
                    key={uploadKey}
                    value={null}
                    onChange={addImage}
                    label={t('products.form.add_image')}
                    className="h-24 w-24"
                />
            </div>
        </div>
    )
}
