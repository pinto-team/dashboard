import { useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
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

type LocationState = { from?: string };

export default function LoginPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const location = useLocation() as Location & { state?: LocationState };
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    return (
        <div className={cn("min-h-dvh grid place-items-center p-6", "bg-background text-foreground")}>
            <div className="w-full max-w-md">
                {/* برند/عنوان بالا */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 justify-center mb-2">
                        <span className="inline-block size-3 rounded-full bg-primary" />
                        <span className="font-bold">My Dashboard</span>
                    </div>
                    <H2 className="mb-1">{t("login")}</H2>
                    <Lead>{t("welcome")}</Lead>
                </div>

                {/* کارت فرم */}
                <Card className="card-surface">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <LogIn className="size-4 opacity-70" />
                            {t("login")}
                            <Badge variant="secondary" className="ms-auto">Secure</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <form
                            className="grid gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget as HTMLFormElement;
                                const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                                setLoading(true);
                                setTimeout(() => {
                                    login(email);
                                    const to = location.state?.from || "/";
                                    navigate(to, { replace: true });
                                }, 500);
                            }}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t("email")}</Label>
                                <div className="relative">
                                    <Mail className="size-4 absolute top-1/2 -translate-y-1/2 start-3 opacity-60" />
                                    <Input
                                        id="email"
                                        name="email"
                                        dir="ltr"
                                        inputMode="email"
                                        className="ps-9 font-mono text-sm"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t("password")}</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    dir="ltr"
                                    className="text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {loading ? t("loading") : t("signIn")}
                            </Button>
                        </form>

                        <Separator />

                        {/* نکات امنیتی/راهنما */}
                        <div className="muted-surface p-3 rounded-[var(--radius)] flex items-start gap-2">
                            <Shield className="size-4 mt-0.5 opacity-70" />
                            <Small className="leading-5">
                                از ایمیل درست استفاده کنید. با تغییر تم یا زبان، این صفحه با دیزاین سیستم هماهنگ می‌ماند.
                            </Small>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
