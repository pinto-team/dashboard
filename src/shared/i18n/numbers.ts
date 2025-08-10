import type { Locale } from "@/shared/i18n/messages";

const LOCALE_MAP: Record<Locale, string> = {
    fa: "fa-IR",
    en: "en-US",
};

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
    const resolvedLocale = LOCALE_MAP[locale];
    return new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const ENGLISH_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export function toPersianDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string | number): string {
    return String(input).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d as (typeof PERSIAN_DIGITS)[number])));
}

export function convertDigitsByLocale(input: string | number, locale: Locale): string {
    return locale === "fa" ? toPersianDigits(input) : toEnglishDigits(input);
}