import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import CategoryImageUploader from '@/features/categories/components/layout/Uploader/CategoryImageUploader.tsx';
import { useI18n } from '@/shared/hooks/useI18n.ts';
import { CreateCategoryRequest } from '@/features/categories/model/types';

type Props = Readonly<{
    initialImageUrl?: string | null;
}>;

export default function CategoryImageField({ initialImageUrl }: Props) {
    const { t } = useI18n();
    const { setValue, watch } = useFormContext<CreateCategoryRequest>();
    const imageUrl = watch('image_url') || initialImageUrl || '';

    React.useEffect(() => {
        setValue('image_url', initialImageUrl || '', { shouldDirty: false });
    }, [initialImageUrl, setValue]);

    return (
        <div className="flex flex-col">
            <CategoryImageUploader
                value={imageUrl}
                onChange={(file) => {
                    setValue('image_id', file?.id || '', { shouldDirty: true });
                    setValue('image_url', file?.url || '', { shouldDirty: true });
                }}
                label={t('categories.form.image')}
                aspect="square"
                className="h-56 w-full self-start"
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {t('categories.form.image_help')}
            </p>
        </div>
    );
}