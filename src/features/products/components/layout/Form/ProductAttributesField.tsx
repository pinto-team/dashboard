import * as React from 'react'
import { X, Plus } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CreateProductRequest } from '@/features/products/model/types'

export default function ProductAttributesField() {
    const { t } = useI18n()
    const { control, register } = useFormContext<CreateProductRequest>()
    const { fields, append, remove } = useFieldArray({ name: 'attributes', control })

    return (
        <div className="grid gap-2">
            <Label>{t('products.form.attributes')}</Label>
            <div className="grid gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <Input
                            placeholder={t('products.form.key') as string}
                            {...register(`attributes.${index}.key` as const)}
                        />
                        <Input
                            placeholder={t('products.form.value') as string}
                            {...register(`attributes.${index}.value` as const)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-fit"
                onClick={() => append({ key: '', value: '' })}
            >
                <Plus className="mr-1 h-4 w-4" />
                {t('products.form.add_attribute')}
            </Button>
        </div>
    )
}
