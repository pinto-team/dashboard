import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { useFormContext } from 'react-hook-form'
import type { CreateCategoryRequest } from '@/features/categories/model/types'

export default function CategoryGeneralFields() {
    const { t } = useI18n()
    const { register, formState: { errors } } = useFormContext<CreateCategoryRequest>()

    return (
        <>
            <div>
                <Label htmlFor="category-name">{t('categories.form.name')}*</Label>
                <Input
                    id="category-name"
                    placeholder={t('categories.form.name_ph')}
                    aria-invalid={Boolean(errors.name)}
                    {...register('name')}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="category-description">{t('categories.form.description')}</Label>
                <textarea
                    id="category-description"
                    placeholder={t('categories.form.description_ph')}
                    className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-invalid={Boolean(errors.description)}
                    {...register('description')}
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                )}
            </div>
        </>
    )
}
