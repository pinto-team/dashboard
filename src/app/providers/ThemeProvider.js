import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function ThemeProvider({ children }) {
    const [theme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved)
            return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);
    return _jsx(_Fragment, { children: children });
}
