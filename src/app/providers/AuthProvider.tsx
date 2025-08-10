import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthCtx = {
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    user: { email: string } | null;
};

const Ctx = createContext<AuthCtx | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("auth_user");
        if (raw) setUser(JSON.parse(raw));
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

    return (
        <Ctx.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
            {children}
        </Ctx.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
