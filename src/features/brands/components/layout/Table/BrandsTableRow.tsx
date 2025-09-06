// features/brands/components/BrandsTableRow.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/app/routes/routes";
import { toAbsoluteUrl } from "@/shared/api/files";
import { useI18n } from "@/shared/hooks/useI18n";
import type { BrandData } from "@/features/brands/model/types";

type Props = {
    brand: BrandData;
    onDelete: (id: string) => void;
    onRowEnter?: (id: string) => void; // اگر جایی لازم شد
};

export default function BrandsTableRow({ brand, onDelete }: Props) {
    const { t } = useI18n();
    const navigate = useNavigate();

    const goEdit = React.useCallback(
        () => navigate(ROUTES.BRAND.EDIT(brand.id)),
        [navigate, brand.id]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goEdit();
        }
    };

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
            onClick={goEdit}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label={t("brands.actions.edit_aria", { name: brand.name }) as string}
            title={t("brands.actions.edit") as string}
        >
            <TableCell>
                {brand.logo_url ? (
                    <img
                        src={toAbsoluteUrl(brand.logo_url)}
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

            <TableCell className="font-medium">{brand.name}</TableCell>
            <TableCell>{brand.country ?? "-"}</TableCell>

            <TableCell>
                {brand.website ? (
                    <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer external"
                        className="text-primary underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {brand.website}
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
                        onDelete(brand.id);
                    }}
                    aria-label={
                        (t("brands.actions.delete_aria", { name: brand.name }) as string) ?? "Delete"
                    }
                    title={(t("brands.actions.delete") as string) ?? "Delete"}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
