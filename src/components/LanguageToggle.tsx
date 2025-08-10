import { Button } from "@/components/ui/button.tsx";
import { useI18n } from "@/shared/hooks/useI18n.ts";

export default function LanguageToggle() {
    const { locale, setLocale } = useI18n();
    return (
        <Button variant="outline" size="sm" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
            {locale.toUpperCase()}
        </Button>
    );
}
