import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { useFormContext } from 'react-hook-form'
import type { BrandFormValues } from '@/features/brands/model/types.ts'

export default function BrandGeneralFields() {
    const { t } = useI18n()
    const {
        register,
        formState: { errors },
    } = useFormContext<BrandFormValues>()

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="brand-name-en">{t('brands.form.name_en')}*</Label>
                    <Input
                        id="brand-name-en"
                        placeholder={t('brands.form.name_en_ph')}
                        autoComplete="organization"
                        aria-invalid={Boolean(errors.name?.['en-US'])}
                        {...register('name.en-US' as const)}
                    />
                    {errors.name?.['en-US'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.name['en-US']?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="brand-name-fa">{t('brands.form.name_fa')}*</Label>
                    <Input
                        id="brand-name-fa"
                        placeholder={t('brands.form.name_fa_ph')}
                        autoComplete="organization"
                        aria-invalid={Boolean(errors.name?.['fa-IR'])}
                        {...register('name.fa-IR' as const)}
                    />
                    {errors.name?.['fa-IR'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.name['fa-IR']?.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="brand-description-en">
                        {t('brands.form.description_en')}
                    </Label>
                    <textarea
                        id="brand-description-en"
                        placeholder={t('brands.form.description_en_ph')}
                        className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-invalid={Boolean(errors.description?.['en-US'])}
                        {...register('description.en-US' as const)}
                    />
                    {errors.description?.['en-US'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.description['en-US']?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="brand-description-fa">
                        {t('brands.form.description_fa')}
                    </Label>
                    <textarea
                        id="brand-description-fa"
                        placeholder={t('brands.form.description_fa_ph')}
                        className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-invalid={Boolean(errors.description?.['fa-IR'])}
                        {...register('description.fa-IR' as const)}
                    />
                    {errors.description?.['fa-IR'] && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.description['fa-IR']?.message}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
