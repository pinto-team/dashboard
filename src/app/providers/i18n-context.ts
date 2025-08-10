import { createContext } from "react";
import type { Locale } from "@/shared/i18n/messages";

export type I18nCtxType = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (key: string) => string;
};

export const I18nCtx = createContext<I18nCtxType | null>(null);
