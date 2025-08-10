import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved)
            return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => setTheme(t => (t === "dark" ? "light" : "dark")), children: theme === "dark" ? "🌙" : "☀️" }));
}
