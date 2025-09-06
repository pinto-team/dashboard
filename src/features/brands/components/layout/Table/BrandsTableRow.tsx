import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/app/routes/routes";
import { toAbsoluteUrl } from "@/shared/api/files";
import { useI18n } from "@/shared/hooks/useI18n";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { BrandData } from "@/features/brands/model/types";

type Props = { brand: BrandData; onDelete: (id: string) => void; };

export default function BrandsTableRow({ brand, onDelete }: Props) {
    const { t } = useI18n();
    const navigate = useNavigate();

    const goDetail = () => navigate(ROUTES.BRAND.DETAIL(brand.id));
    const goEdit = () => navigate(ROUTES.BRAND.EDIT(brand.id));

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
            onClick={goDetail}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goDetail(); }
            }}
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
                ) : <div className="h-10 w-10 rounded bg-muted" onClick={(e)=>e.stopPropagation()} />}
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
                ) : ("-")}
            </TableCell>

            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={t("common.more_actions") as string}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={goEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t("brands.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(brand.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("brands.actions.delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
