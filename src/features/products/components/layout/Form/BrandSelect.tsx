import * as React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { brandsQueries } from '@/features/brands'
import { useI18n } from '@/shared/hooks/useI18n'
import { getLocalizedValue } from '@/shared/utils/localized'

interface Props {
  value?: string
  onChange: (value: string) => void
}

export default function BrandSelect({ value, onChange }: Props) {
  const { t, locale } = useI18n()
  const [search, setSearch] = React.useState('')
  const { data, isLoading } = brandsQueries.useList({ page: 1, limit: 50, q: search })
  const options = data?.data ?? []

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('products.form.brand_id_ph') as string} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder={t('common.search_hint') as string}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        {options.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {getLocalizedValue(b.name, locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
