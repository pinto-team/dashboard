import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { I18nCtx } from "./i18n-context";
import { messages } from "@/shared/i18n/messages";
import { convertDigitsByLocale } from "@/shared/i18n/numbers";
export default function I18nProvider({ children }) {
    const [locale, setLocale] = useState(() => localStorage.getItem("locale") || "fa");
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("lang", locale);
        root.setAttribute("dir", locale === "fa" ? "rtl" : "ltr");
        localStorage.setItem("locale", locale);
    }, [locale]);
    const t = useMemo(() => {
        const dict = messages[locale] || {};
        return (key, params) => {
            const template = dict[key] ?? key;
            if (!params)
                return template;
            return Object.keys(params).reduce((acc, k) => {
                const raw = params[k];
                const value = typeof raw === "number" ? convertDigitsByLocale(raw, locale) : String(raw);
                return acc.replaceAll(`{${k}}`, value);
            }, template);
        };
    }, [locale]);
    return _jsx(I18nCtx.Provider, { value: { locale, setLocale, t }, children: children });
}
