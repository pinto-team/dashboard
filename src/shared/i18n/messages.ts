export type Locale = "fa" | "en";

export const messages: Record<Locale, Record<string, string>> = {
    fa: {
        appTitle: "داشبورد من",
        login: "ورود",
        email: "ایمیل",
        password: "رمز عبور",
        signIn: "ورود",
        loading: "در حال ورود...",
        dashboard: "داشبورد",
        welcome: "به داشبورد خوش آمدید",
        sampleCardTitle: "کارت نمونه",
        primary: "اولیه",
        secondary: "ثانویه",
        outline: "حاشیه‌دار",
        back: "بازگشت",
    },
    en: {
        appTitle: "My Dashboard",
        login: "Login",
        email: "Email",
        password: "Password",
        signIn: "Sign in",
        loading: "Loading...",
        dashboard: "Dashboard",
        welcome: "Welcome to the dashboard",
        sampleCardTitle: "Sample Card",
        primary: "Primary",
        secondary: "Secondary",
        outline: "Outline",
        back: "Back",
    },
};
