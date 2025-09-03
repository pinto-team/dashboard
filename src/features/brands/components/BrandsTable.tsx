import * as React from "react";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { ROUTES } from "@/app/routes/routes";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/shared/hooks/useI18n";
import { toAbsoluteUrl } from "@/shared/api/files";

import type { BrandData } from "@/features/brands/model/types";

type Props = Readonly<{
    items: ReadonlyArray<BrandData>;
    /** حذف واقعی (Optimistic) */
    onDelete: (id: string) => void;
    /** بازگردانی حذف (Restore/Re-create) — در صورت داشتن Undo درون‌جدول استفاده می‌شود */
    onUndoDelete?: (id: string) => void;
    /** اگر true باشد، UndoBar داخل همین جدول نشان داده می‌شود؛ در غیر این صورت هیچ Undo UIای اینجا رندر نمی‌شود */
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

    // فقط وقتی inline Undo می‌خواهیم، state داخلی نگه می‌داریم
    const [pending, setPending] = React.useState<null | { id: string }>(null);
    const UNDO_DURATION = 5000;

    const goEdit = React.useCallback(
        (id: string) => navigate(ROUTES.BRAND.EDIT(id)),
        [navigate]
    );

    // حذف فوری
    const handleDeleteClick = React.useCallback(
        (id: string) => {
            onDelete(id); // حذف همین الآن (Optimistic)

            // اگر می‌خواهیم Undo داخل جدول باشد:
            if (showUndoInline) {
                setPending({ id });
            }
        },
        [onDelete, showUndoInline]
    );

    const handleUndo = React.useCallback(() => {
        if (pending && onUndoDelete) onUndoDelete(pending.id);
        setPending(null);
    }, [pending, onUndoDelete]);

    const handleTimeout = React.useCallback(() => setPending(null), []);

    return (
        <div className="relative overflow-hidden rounded-xl border">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-16">{t("brands.table.logo")}</TableHead>
                        <TableHead>{t("brands.table.name")}</TableHead>
                        <TableHead>{t("brands.table.country")}</TableHead>
                        <TableHead>{t("brands.table.website")}</TableHead>
                        <TableHead className="w-20 text-right">
                            {t("brands.table.actions")}
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
                                {t("common.no_results")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((b) => (
                            <TableRow
                                key={b.id}
                                className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
                                onClick={() => goEdit(b.id)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        goEdit(b.id);
                                    }
                                }}
                                aria-label={
                                    t("brands.actions.edit_aria", { name: b.name }) as string
                                }
                                title={t("brands.actions.edit") as string}
                            >
                                <TableCell>
                                    {b.logo_url ? (
                                        <img
                                            src={toAbsoluteUrl(b.logo_url)}
                                            alt={t("brands.logo_alt") as string}
                                            className="h-10 w-10 rounded object-contain"
                                            loading="lazy"
                                            decoding="async"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded bg-muted"
                                            aria-label={t("brands.no_logo") as string}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </TableCell>

                                <TableCell className="font-medium">{b.name}</TableCell>
                                <TableCell>{b.country ?? "-"}</TableCell>

                                <TableCell>
                                    {b.website ? (
                                        <a
                                            href={b.website}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                            className="text-primary underline underline-offset-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {b.website}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(b.id);
                                        }}
                                        aria-label={
                                            t("brands.actions.delete_aria", { name: b.name }) as string
                                        }
                                        title={t("brands.actions.delete") as string}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
