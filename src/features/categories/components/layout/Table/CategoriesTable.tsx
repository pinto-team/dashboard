import * as React from 'react'
import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CategoryData } from '@/features/categories/model/types'

type Props = Readonly<{
    items: ReadonlyArray<CategoryData>
    onDelete: (id: string) => void
}>

export default function CategoriesTable({ items, onDelete }: Props): JSX.Element {
    const { t } = useI18n()
    const navigate = useNavigate()

    const goDetail = React.useCallback(
        (id: string) => navigate(ROUTES.CATEGORY.DETAIL(id)),
        [navigate],
    )
    const goEdit = React.useCallback(
        (id: string) => navigate(ROUTES.CATEGORY.EDIT(id)),
        [navigate],
    )

    const getParentName = React.useCallback(
        (parentId?: string | null) =>
            items.find((x) => x.id === parentId)?.name ?? '-',
        [items],
    )

    return (
        <div className="relative overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
                    <TableRow className="h-10">
                        <TableHead className="px-3 text-xs font-medium text-muted-foreground">
                            {t('categories.table.name')}
                        </TableHead>
                        <TableHead className="px-3 text-xs font-medium text-muted-foreground">
                            {t('categories.table.parent')}
                        </TableHead>
                        <TableHead className="w-16 px-3 text-right text-xs font-medium text-muted-foreground">
                            {t('categories.table.actions')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((c) => (
                        <TableRow
                            key={c.id}
                            className="h-12 cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
                            onClick={() => goDetail(c.id)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    goDetail(c.id)
                                }
                            }}
                        >
                            <TableCell className="px-3 py-2.5 font-medium">
                                {c.name}
                            </TableCell>
                            <TableCell className="px-3 py-2.5">
                                {getParentName(c.parent_id)}
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
                                    <DropdownMenuContent
                                        align="end"
                                        sideOffset={6}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem onClick={() => goEdit(c.id)}>
                                            <Pencil className="mr-2 size-4" />
                                            {t('categories.actions.edit')}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => onDelete(c.id)}
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            {t('categories.actions.delete')}
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
