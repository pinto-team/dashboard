import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { useFormContext } from 'react-hook-form'
import { CreateBrandRequest } from '@/features/brands/model/types.ts'

export default function BrandGeneralFields() {
    const { t } = useI18n()
    const {
        register,
        formState: { errors },
    } = useFormContext<CreateBrandRequest>()

    return (
        <>
            <div>
                <Label htmlFor="brand-name">{t('brands.form.name')}*</Label>
                <Input
                    id="brand-name"
                    placeholder={t('brands.form.name_ph')}
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.name)}
                    {...register('name')}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="brand-description">
                    {t('brands.form.description')}
                </Label>
                <textarea
                    id="brand-description"
                    placeholder={t('brands.form.description_ph')}
                    className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-invalid={Boolean(errors.description)}
                    {...register('description')}
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>
        </>
    )
}
