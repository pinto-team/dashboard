import * as React from "react";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { ROUTES } from "@/app/routes/routes.ts";
import { Button } from "@/components/ui/button.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { useI18n } from "@/shared/hooks/useI18n.ts";
import { toAbsoluteUrl } from "@/shared/api/files.ts";

import type { BrandData } from "@/features/brands/model/types.ts";

type Props = Readonly<{
    items: ReadonlyArray<BrandData>;
    onDelete: (id: string) => void;
    onUndoDelete?: (id: string) => void;
    showUndoInline?: boolean;
}>;

export default function BrandsTable({
                                        items,
                                        onDelete,
                                        onUndoDelete,
                                        showUndoInline = false,
                                    }: Props): JSX.Element {
    const { t } = useI18n();
    const navigate = useNavigate();

    const [pending, setPending] = React.useState<null | { id: string }>(null);
    const UNDO_DURATION = 5000;

    const goEdit = React.useCallback(
        (id: string) => navigate(ROUTES.BRAND.EDIT(id)),
        [navigate]
    );

    const handleDeleteClick = React.useCallback(
        (id: string) => {
            onDelete(id);
            if (showUndoInline) setPending({ id });
        },
        [onDelete, showUndoInline]
    );

    const handleUndo = React.useCallback(() => {
        if (pending && onUndoDelete) onUndoDelete(pending.id);
        setPending(null);
    }, [pending, onUndoDelete]);

    const handleTimeout = React.useCallback(() => setPending(null), []);

    React.useEffect(() => {
        if (!pending) return;
        const id = setTimeout(handleTimeout, UNDO_DURATION);
        return () => clearTimeout(id);
    }, [pending, handleTimeout]);

    return (
        <div className="relative overflow-hidden rounded-lg border"> {/* گردی هم‌راستای shadcdn */}
            <Table>
                {/* هدر چسبنده + پس‌زمینه‌ی ملایم + ارتفاع و پدینگ یکنواخت */}
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

                {/* تراکم یکنواخت سلول‌ها: py-2.5 + px-3 (روی lg: px-4) */}
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="h-24 px-3 text-center text-sm text-muted-foreground"
                            >
                                {t("common.no_results")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((b) => (
                            <TableRow
                                key={b.id}
                                className="h-12 cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
                                onClick={() => goEdit(b.id)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        goEdit(b.id);
                                    }
                                }}
                                aria-label={t("brands.actions.edit_aria", { name: b.name }) as string}
                                title={t("brands.actions.edit") as string}
                            >
                                {/* لوگو باریک‌تر و منظم */}
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

                                {/* نام: فونت متوسط + truncate برای ردیف‌های طولانی */}
                                <TableCell className="max-w-[18rem] px-3 py-2.5 font-medium lg:max-w-[24rem] lg:px-4">
                                    <span className="block truncate">{b.name}</span>
                                </TableCell>

                                {/* کشور: عرض ثابت کوچیک تا لرزش نگیریم */}
                                <TableCell className="w-40 px-3 py-2.5 lg:px-4">
                                    {b.country ?? "-"}
                                </TableCell>

                                {/* وب‌سایت: لینک جمع‌وجور با ellipsis و underline ملایم */}
                                <TableCell className="px-3 py-2.5 lg:px-4">
                                    {b.website ? (
                                        <a
                                            href={b.website}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                            className="block max-w-[22ch] truncate underline-offset-4 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                            title={b.website}
                                        >
                                            {b.website}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>

                                {/* اکشن: دکمه‌ی 32px مثل نمونه‌ی shadcdn */}
                                <TableCell className="px-3 py-2.5 text-right lg:px-4">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="size-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(b.id);
                                        }}
                                        aria-label={
                                            t("brands.actions.delete_aria", { name: b.name }) as string
                                        }
                                        title={t("brands.actions.delete") as string}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* نوار Undo اختیاری (در صورت فعال بودن) */}
            {showUndoInline && pending && (
                <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-3 rounded-md border bg-background/95 p-3 shadow">
          <span className="text-sm">
            {t("common.deleted_temporarily") as string}
          </span>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={handleUndo}>
                            {t("common.undo") as string}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
