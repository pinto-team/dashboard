import * as React from "react";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { ROUTES } from "@/app/routes/routes.ts";
import { Button } from "@/components/ui/button.tsx";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useI18n } from "@/shared/hooks/useI18n.ts";
import { toAbsoluteUrl } from "@/shared/api/files.ts";
import type { BrandData } from "@/features/brands/model/types.ts";
import { convertDigitsByLocale } from "@/shared/i18n/numbers.ts";

type Props = Readonly<{
    items: ReadonlyArray<BrandData>;
    onDelete: (id: string) => void;
    onUndoDelete?: (id: string) => void;
    showUndoInline?: boolean;
}>;

export default function BrandsTable({
                                        items, onDelete, onUndoDelete, showUndoInline = false,
                                    }: Props): JSX.Element {
    const { t, locale } = useI18n();
    const navigate = useNavigate();

    const goDetail = React.useCallback(
        (id: string) => navigate(ROUTES.BRAND.DETAIL(id)),
        [navigate]
    );
    const goEdit = React.useCallback(
        (id: string) => navigate(ROUTES.BRAND.EDIT(id)),
        [navigate]
    );

    return (
        <div className="relative overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
                    <TableRow className="h-10">
                        <TableHead className="w-14 px-3 text-xs font-medium text-muted-foreground">
                            {t("brands.table.logo")}
                        </TableHead>
                        <TableHead className="px-3 text-xs font-medium text-muted-foreground">
                            {t("brands.table.name")}
                        </TableHead>
                        <TableHead className="px-3 text-xs font-medium text-muted-foreground">
                            {t("brands.table.country")}
                        </TableHead>
                        <TableHead className="px-3 text-xs font-medium text-muted-foreground">
                            {t("brands.table.website")}
                        </TableHead>
                        <TableHead className="w-16 px-3 text-right text-xs font-medium text-muted-foreground">
                            {t("brands.table.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((b) => (
                        <TableRow
                            key={b.id}
                            className="h-12 cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
                            onClick={() => goDetail(b.id)}
                            tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        goDetail(b.id);
                                    }
                                }}
                            >
                                <TableCell className="px-3">
                                    {b.logo_url ? (
                                        <img
                                            src={toAbsoluteUrl(b.logo_url)}
                                            alt={t("brands.logo_alt") as string}
                                            className="size-8 rounded object-contain lg:size-9"
                                            loading="lazy"
                                            decoding="async"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <div
                                            className="size-8 rounded bg-muted lg:size-9"
                                            aria-label={t("brands.no_logo") as string}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </TableCell>

                                <TableCell className="max-w-[18rem] px-3 py-2.5 font-medium lg:max-w-[24rem] lg:px-4">
                                    <span className="block truncate">{convertDigitsByLocale(b.name, locale)}</span>
                                </TableCell>

                                <TableCell className="w-40 px-3 py-2.5 lg:px-4">
                                    {convertDigitsByLocale(b.country ?? "-", locale)}
                                </TableCell>

                                <TableCell className="px-3 py-2.5 lg:px-4">
                                    {b.website ? (
                                        <a
                                            href={b.website}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                            className="block max-w-[22ch] truncate underline-offset-4 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                            title={convertDigitsByLocale(b.website, locale)}
                                        >
                                            {convertDigitsByLocale(b.website, locale)}
                                        </a>
                                    ) : ("-")}
                                </TableCell>

                                <TableCell className="px-3 py-2.5 text-right lg:px-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 p-0"
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={t("common.more_actions") as string}
                                            >
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={() => goEdit(b.id)}>
                                                <Pencil className="mr-2 size-4" />
                                                {t("brands.actions.edit")}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => onDelete(b.id)}
                                            >
                                                <Trash2 className="mr-2 size-4" />
                                                {t("brands.actions.delete")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
