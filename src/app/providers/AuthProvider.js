import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext(null);
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const raw = localStorage.getItem("auth_user");
        if (raw)
            setUser(JSON.parse(raw));
    }, []);
    const login = (email) => {
        const u = { email };
        setUser(u);
        localStorage.setItem("auth_user", JSON.stringify(u));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };
    return (_jsx(Ctx.Provider, { value: { isAuthenticated: !!user, user, login, logout }, children: children }));
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
