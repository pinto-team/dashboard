import { useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nCtx } from "./i18n-context";
import { messages, type Locale } from "@/shared/i18n/messages";
import { convertDigitsByLocale } from "@/shared/i18n/numbers";

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(() => {
        const saved = localStorage.getItem("locale") as Locale | null;
        return saved ?? "en"; // اگر نبود، en
    });
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("lang", locale);
        root.setAttribute("dir", locale === "fa" ? "rtl" : "ltr");
        localStorage.setItem("locale", locale);
    }, [locale]);

    const t = useMemo(() => {
        const dict = messages[locale] || {};
        return (key: string, params?: Record<string, string | number>) => {
            const template = dict[key] ?? key;
            if (!params) return template;
            return Object.keys(params).reduce((acc, k) => {
                const raw = params[k]!;
                const value = typeof raw === "number" ? convertDigitsByLocale(raw, locale) : String(raw);
                return acc.replaceAll(`{${k}}`, value);
            }, template);
        };
    }, [locale]);

    return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}
