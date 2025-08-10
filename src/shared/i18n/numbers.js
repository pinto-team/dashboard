const LOCALE_MAP = {
    fa: "fa-IR",
    en: "en-US",
};
export function formatNumber(value, locale, options) {
    const resolvedLocale = LOCALE_MAP[locale];
    return new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ENGLISH_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export function toPersianDigits(input) {
    return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}
export function toEnglishDigits(input) {
    return String(input).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}
export function convertDigitsByLocale(input, locale) {
    return locale === "fa" ? toPersianDigits(input) : toEnglishDigits(input);
}
