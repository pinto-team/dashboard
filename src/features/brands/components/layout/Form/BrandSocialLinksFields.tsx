import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import type { BrandFormValues } from '@/features/brands/model/types.ts'
import { SOCIAL_LINK_KEYS } from '@/shared/constants/socialLinks.ts'
import { useI18n } from '@/shared/hooks/useI18n.ts'

function formatSocialLabel(key: string, t: ReturnType<typeof useI18n>['t']): string {
    const translationKey = `brands.form.social.${key}` as const
    const translated = t(translationKey)
    if (translated && translated !== translationKey) {
        return translated as string
    }

    return key.charAt(0).toUpperCase() + key.slice(1)
}

export default function BrandSocialLinksFields() {
    const { t } = useI18n()
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<BrandFormValues>()

    const { fields, append, remove } = useFieldArray({ control, name: 'social_links' })
    const socialValues = useWatch({ control, name: 'social_links' }) as BrandFormValues['social_links']

    const selectedKeys = Array.isArray(socialValues)
        ? socialValues.map((item) => item?.key ?? '')
        : []

    const socialErrors = errors.social_links

    return (
        <div className="grid gap-3">
            {fields.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    {t('brands.form.social.empty')}
                </div>
            ) : (
                <div className="grid gap-3">
                    {fields.map((field, index) => {
                        const fieldErrors = Array.isArray(socialErrors) ? socialErrors[index] : undefined
                        const keyError = fieldErrors && 'key' in fieldErrors ? fieldErrors.key : undefined
                        const urlError = fieldErrors && 'url' in fieldErrors ? fieldErrors.url : undefined

                        return (
                            <div
                                key={field.id}
                                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)_auto] sm:items-start"
                            >
                                <div className="grid gap-1">
                                    <Label htmlFor={`brand-social-${index}-network`}>
                                        {t('brands.form.social.network')}
                                    </Label>
                                    <Controller
                                        control={control}
                                        name={`social_links.${index}.key` as const}
                                        render={({ field: controllerField }) => {
                                            const { value, onChange, onBlur } = controllerField
                                            const selectedValue = value ?? ''
                                            return (
                                                <Select
                                                    value={selectedValue || undefined}
                                                    onValueChange={(option) => {
                                                        onChange(option)
                                                    }}
                                                    onOpenChange={(open) => {
                                                        if (!open) {
                                                            onBlur()
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        id={`brand-social-${index}-network`}
                                                        aria-invalid={Boolean(keyError)}
                                                    >
                                                        <SelectValue
                                                            placeholder={t('brands.form.social.select_network') as string}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {SOCIAL_LINK_KEYS.map((key) => {
                                                            const isSelectedElsewhere = selectedKeys.some(
                                                                (selectedKey, selectedIndex) =>
                                                                    selectedIndex !== index && selectedKey === key,
                                                            )
                                                            return (
                                                                <SelectItem
                                                                    key={key}
                                                                    value={key}
                                                                    disabled={isSelectedElsewhere}
                                                                >
                                                                    {formatSocialLabel(key, t)}
                                                                </SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            )
                                        }}
                                    />
                                    {keyError && (
                                        <p className="mt-1 text-xs text-destructive">{keyError.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor={`brand-social-${index}-url`}>
                                        {t('brands.form.social.url')}
                                    </Label>
                                    <Input
                                        id={`brand-social-${index}-url`}
                                        placeholder={t('brands.form.social.url_placeholder')}
                                        autoComplete="url"
                                        aria-invalid={Boolean(urlError)}
                                        {...register(`social_links.${index}.url` as const)}
                                    />
                                    {urlError && (
                                        <p className="mt-1 text-xs text-destructive">{urlError.message}</p>
                                    )}
                                </div>

                                <div className="flex items-start justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        aria-label={t('brands.form.social.remove') as string}
                                        title={t('brands.form.social.remove') as string}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-fit"
                onClick={() => append({ key: '', url: '' })}
            >
                <Plus className="mr-1 h-4 w-4" />
                {t('brands.form.social.add')}
            </Button>
        </div>
    )
}
