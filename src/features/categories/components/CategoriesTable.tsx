import * as React from 'react'
import { JSX } from 'react'

import { Link } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { Button } from '@/components/ui/button'
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from '@/components/ui/table'
import { useI18n } from '@/shared/hooks/useI18n'

import type { CategoryData } from '@/features/categories/model/types'

type Props = Readonly<{
items: ReadonlyArray<CategoryData>
    onDelete?: (id: string) => void
    }>

    export default function CategoriesTable({ items, onDelete }: Props): JSX.Element {
    const { t } = useI18n()

    const handleDelete = React.useCallback(
    (id: string) => {
    if (!onDelete) return
    const ok = window.confirm(
    t('category.confirm_delete') ??
    'Are you sure you want to delete this category?',
    )
    if (!ok) return
    onDelete(id)
    },
    [onDelete, t],
    )

    return (
    <div className="overflow-hidden rounded-xl border">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead>{t('category.table.name')}</TableHead>
                    <TableHead className="w-40 text-right">
                        {t('category.table.actions')}
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {items.length === 0 ? (
                <TableRow>
                    <TableCell
                        colSpan={2}
                        className="h-24 text-center text-sm text-muted-foreground"
                    >
                        {t('common.no_results')}
                    </TableCell>
                </TableRow>
                ) : (
                items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>

                    <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            aria-label={
                            t('category.actions.edit_aria', {
                        name: item.name,
                        }) as string
                        }
                        title={t('category.actions.edit') as string}
                        >
                        <Link to={ROUTES.CATEGORY.EDIT(item.id)}>
                        {t('category.actions.edit')}
                        </Link>
                        </Button>

                        {onDelete && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                        aria-label={
                        t('category.actions.delete_aria', {
                        name: item.name,
                        }) as string
                        }
                        title={t('category.actions.delete') as string}
                        >
                        {t('category.actions.delete')}
                        </Button>
                        )}
                    </TableCell>
                </TableRow>
                ))
                )}
            </TableBody>
        </Table>
    </div>
    )
    }