import { useEffect, useState, type ReactNode } from "react";
import { Ctx } from "./auth-context";
import type { AuthCtx } from "./auth-types";

type User = { email: string } | null;

function getInitialUser(): User {
    try {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem("auth_user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    // مقدار اولیه را مستقیم از localStorage می‌گیریم تا فلش/سفیدی نباشد
    const [user, setUser] = useState<User>(getInitialUser);
    // اگر بخواهی می‌توانیم ready را نگه داریم؛ با lazy-init عملاً از همان ابتدا true است
    const [ready] = useState(true);

    // همگام‌سازی با تغییرات تب‌های دیگر
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "auth_user") {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const login = (email: string) => {
        const u = { email };
        setUser(u);
        localStorage.setItem("auth_user", JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    const value: AuthCtx = {
        isAuthenticated: !!user,
        user,
        login,
        logout,
        ready,
    };

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
