import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <Button variant="outline" size="sm" onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "🌙" : "☀️"}
        </Button>
    );
}
