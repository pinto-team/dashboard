import { useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme") as Theme | null;
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return <>{children}</>;
}
