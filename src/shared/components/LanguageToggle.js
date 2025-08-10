import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@/shared/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
export default function LanguageToggle() {
    const { locale, setLocale } = useI18n();
    return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => setLocale(locale === "fa" ? "en" : "fa"), children: locale.toUpperCase() }));
}
