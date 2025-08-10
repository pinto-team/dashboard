import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useI18n } from "@/shared/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { H2, Lead, Small } from "@/shared/components/typography";
import { cn } from "@/lib/utils";
import { LogIn, Mail, Shield } from "lucide-react";
export default function LoginPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    return (_jsx("div", { className: cn("min-h-dvh grid place-items-center p-6", "bg-background text-foreground"), children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-6 text-center", children: [_jsxs("div", { className: "inline-flex items-center gap-2 justify-center mb-2", children: [_jsx("span", { className: "inline-block size-3 rounded-full bg-primary" }), _jsx("span", { className: "font-bold", children: t("appTitle") })] }), _jsx(H2, { className: "mb-1", children: t("login") }), _jsx(Lead, { children: t("welcome") })] }), _jsxs(Card, { className: "card-surface", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(LogIn, { className: "size-4 opacity-70" }), t("login"), _jsx(Badge, { variant: "secondary", className: "ms-auto", children: t("secure") })] }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("form", { className: "grid gap-4", onSubmit: (e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const email = form.elements.namedItem("email").value;
                                        setLoading(true);
                                        setTimeout(() => {
                                            login(email);
                                            const to = location.state?.from || "/";
                                            navigate(to, { replace: true });
                                        }, 500);
                                    }, children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "email", children: t("email") }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "size-4 absolute top-1/2 -translate-y-1/2 start-3 opacity-60" }), _jsx(Input, { id: "email", name: "email", dir: "ltr", inputMode: "email", className: "ps-9 font-mono text-sm", placeholder: "name@example.com", required: true })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "password", children: t("password") }), _jsx(Input, { id: "password", name: "password", type: "password", dir: "ltr", className: "text-sm", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-primary text-primary-foreground hover:bg-primary/90", children: loading ? t("loading") : t("signIn") })] }), _jsx(Separator, {}), _jsxs("div", { className: "muted-surface p-3 rounded-[var(--radius)] flex items-start gap-2", children: [_jsx(Shield, { className: "size-4 mt-0.5 opacity-70" }), _jsx(Small, { className: "leading-5", children: t("login.securityNote") })] })] })] })] }) }));
}
