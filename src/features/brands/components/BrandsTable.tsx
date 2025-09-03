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
import { toAbsoluteUrl } from '@/shared/api/files'

import type { BrandData } from '@/features/brands/model/types'

type Props = Readonly<{
    items: ReadonlyArray<BrandData>
    onDelete?: (id: string) => void
}>

export default function BrandsTable({ items, onDelete }: Props): JSX.Element {
    const { t } = useI18n()

    const handleDelete = React.useCallback(
        (id: string) => {
            if (!onDelete) return
            const ok = window.confirm(
                t('brands.confirm_delete') ?? 'Are you sure you want to delete this brand?',
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
                        <TableHead className="w-16">{t('brands.table.logo')}</TableHead>
                        <TableHead>{t('brands.table.name')}</TableHead>
                        <TableHead>{t('brands.table.country')}</TableHead>
                        <TableHead>{t('brands.table.website')}</TableHead>
                        <TableHead className="w-40 text-right">
                            {t('brands.table.actions')}
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="h-24 text-center text-sm text-muted-foreground"
                            >
                                {t('common.no_results')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((b) => (
                            <TableRow key={b.id}>
                                <TableCell>
                                    {b.logo_url ? (
                                        <img
                                            src={toAbsoluteUrl(b.logo_url)}
                                            alt={t('brands.logo_alt', { name: b.name }) as string}
                                            className="h-10 w-10 rounded object-contain"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded bg-muted"
                                            aria-label={t('brands.no_logo') as string}
                                        />
                                    )}
                                </TableCell>

                                <TableCell className="font-medium">{b.name}</TableCell>
                                <TableCell>{b.country ?? '-'}</TableCell>

                                <TableCell>
                                    {b.website ? (
                                        <a
                                            href={b.website}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                            className="text-primary underline underline-offset-2"
                                        >
                                            {b.website}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>

                                <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        aria-label={
                                            t('brands.actions.edit_aria', {
                                                name: b.name,
                                            }) as string
                                        }
                                        title={t('brands.actions.edit') as string}
                                    >
                                        <Link to={ROUTES.BRAND.EDIT(b.id)}>
                                            {t('brands.actions.edit')}
                                        </Link>
                                    </Button>

                                    {onDelete && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(b.id)}
                                            aria-label={
                                                t('brands.actions.delete_aria', {
                                                    name: b.name,
                                                }) as string
                                            }
                                            title={t('brands.actions.delete') as string}
                                        >
                                            {t('brands.actions.delete')}
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
