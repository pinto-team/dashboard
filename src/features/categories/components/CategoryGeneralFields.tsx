import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { useFormContext } from 'react-hook-form'
import type { CategoryFormValues } from '@/features/categories/model/types'

type Props = Readonly<{ submitting?: boolean }>

export default function CategoryGeneralFields({ submitting = false }: Props) {
    const { t } = useI18n()
    const {
        register,
        formState: { errors },
    } = useFormContext<CategoryFormValues>()

    return (
        <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="category-name-en">{t('categories.form.name_en')}*</Label>
                    <Input
                        id="category-name-en"
                        placeholder={t('categories.form.name_en_ph')}
                        autoComplete="off"
                        aria-invalid={Boolean(errors.name?.['en-US'])}
                        disabled={submitting}
                        {...register('name.en-US' as const)}
                    />
                    {errors.name?.['en-US'] && (
                        <p className="mt-1 text-xs text-destructive">{errors.name['en-US']?.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="category-name-fa">{t('categories.form.name_fa')}*</Label>
                    <Input
                        id="category-name-fa"
                        placeholder={t('categories.form.name_fa_ph')}
                        autoComplete="off"
                        aria-invalid={Boolean(errors.name?.['fa-IR'])}
                        disabled={submitting}
                        {...register('name.fa-IR' as const)}
                    />
                    {errors.name?.['fa-IR'] && (
                        <p className="mt-1 text-xs text-destructive">{errors.name['fa-IR']?.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="category-description-en">{t('categories.form.description_en')}</Label>
                    <textarea
                        id="category-description-en"
                        placeholder={t('categories.form.description_en_ph')}
                        className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-invalid={Boolean(errors.description?.['en-US'])}
                        disabled={submitting}
                        {...register('description.en-US' as const)}
                    />
                    {errors.description?.['en-US'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.description['en-US']?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="category-description-fa">{t('categories.form.description_fa')}</Label>
                    <textarea
                        id="category-description-fa"
                        placeholder={t('categories.form.description_fa_ph')}
                        className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-invalid={Boolean(errors.description?.['fa-IR'])}
                        disabled={submitting}
                        {...register('description.fa-IR' as const)}
                    />
                    {errors.description?.['fa-IR'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.description['fa-IR']?.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
