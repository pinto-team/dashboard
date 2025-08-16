import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

const LANGS = [
    { code: "fa", label: "FA", name: "فارسی" },
    { code: "en", label: "EN", name: "English" },
    { code: "ar", label: "AR", name: "العربية" },
    { code: "de", label: "DE", name: "Deutsch" },
    { code: "tr", label: "TR", name: "Türkçe" },
];

export default function LanguageToggle() {
    const { locale, setLocale, t } = useI18n();

    useEffect(() => {
        const rtl = ["fa", "ar", "he", "ur"].includes(locale);
        document.documentElement.dir = rtl ? "rtl" : "ltr";
        document.documentElement.lang = locale;
    }, [locale]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="font-medium">
                    {locale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuLabel>{t("changeLanguage")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGS.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onSelect={() => setLocale(l.code)}
                        className="flex items-center justify-between"
                    >
            <span className="flex items-center gap-2">
              <span className="w-9 inline-block text-muted-foreground">{l.label}</span>
              <span>{l.name}</span>
            </span>
                        {locale === l.code ? <Check className="w-4 h-4" /> : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
