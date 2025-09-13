import * as React from 'react'
import { useI18n } from '@/shared/hooks/useI18n'

export function ProductsEmpty() {
  const { t } = useI18n()
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
      {t('common.no_results')}
    </div>
  )
}
