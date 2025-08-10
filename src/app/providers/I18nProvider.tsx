import { useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nCtx } from "./i18n-context";
import { messages, type Locale } from "@/shared/i18n/messages";

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem("locale") as Locale) || "fa");

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("lang", locale);
        root.setAttribute("dir", locale === "fa" ? "rtl" : "ltr");
        localStorage.setItem("locale", locale);
    }, [locale]);

    const t = useMemo(() => {
        const dict = messages[locale] || {};
        return (key: string) => dict[key] ?? key;
    }, [locale]);

    return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}
