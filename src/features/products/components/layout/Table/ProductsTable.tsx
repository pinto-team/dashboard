import * as React from 'react'
import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

import { ROUTES } from '@/app/routes/routes'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/shared/hooks/useI18n'
import type { ProductData } from '@/features/products/model/types'
import { convertDigitsByLocale } from '@/shared/i18n/numbers'

type Props = Readonly<{
  items: ReadonlyArray<ProductData>
  onDelete: (id: string) => void
}>

export default function ProductsTable({ items, onDelete }: Props): JSX.Element {
  const { t, locale } = useI18n()
  const navigate = useNavigate()

  const goEdit = React.useCallback(
    (id: string) => navigate(ROUTES.PRODUCT.EDIT(id)),
    [navigate]
  )

  return (
    <div className="relative overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
          <TableRow className="h-10">
            <TableHead className="px-3 text-xs font-medium text-muted-foreground">
              {t('products.table.name')}
            </TableHead>
            <TableHead className="px-3 text-xs font-medium text-muted-foreground">
              {t('products.table.sku')}
            </TableHead>
            <TableHead className="px-3 text-xs font-medium text-muted-foreground">
              {t('products.table.price')}
            </TableHead>
            <TableHead className="w-16 px-3 text-right text-xs font-medium text-muted-foreground">
              {t('products.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.id} className="h-12">
              <TableCell className="px-3 py-2.5 font-medium">
                {convertDigitsByLocale(p.name, locale)}
              </TableCell>
              <TableCell className="px-3 py-2.5">
                {convertDigitsByLocale(p.sku ?? '-', locale)}
              </TableCell>
              <TableCell className="px-3 py-2.5">
                {convertDigitsByLocale(p.price ?? '-', locale)}
              </TableCell>
              <TableCell className="px-3 py-2.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={t('common.more_actions') as string}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => goEdit(p.id)}>
                      <Pencil className="mr-2 size-4" />
                      {t('products.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(p.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      {t('products.actions.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

