import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PageHeader from "@/shared/components/patterns/PageHeader";
import StatCard from "@/shared/components/patterns/StatCard";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { H3, Small } from "@/shared/components/typography";
import { BarChart3, UserPlus, FileText, Settings, TrendingUp, Users2, ShoppingBag, Ticket } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";
import { dashboardKpis, recentActivities } from "@/mocks/dashboard";
import { formatNumber } from "@/shared/i18n/numbers";
export default function DashboardPage() {
    const { t, locale } = useI18n();
    return (_jsxs("div", { className: "grid gap-6", children: [_jsx(PageHeader, { title: t("dashboard"), subtitle: t("dashboard.subtitle"), actions: _jsxs(_Fragment, { children: [_jsxs(Button, { className: "bg-primary text-primary-foreground hover:bg-primary/90", children: [_jsx(FileText, { className: "size-4 ms-1" }), " ", t("actions.createReport")] }), _jsxs(Button, { variant: "secondary", children: [_jsx(Settings, { className: "size-4 ms-1" }), " ", t("actions.settings")] })] }) }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: dashboardKpis.map((kpi) => (_jsx(StatCard, { label: t(`kpi.${kpi.key}`), value: formatNumber(kpi.value, locale), delta: kpi.deltaPercent >= 0
                        ? t("kpi.delta.positive", { value: kpi.deltaPercent })
                        : t("kpi.delta.negative", { value: Math.abs(kpi.deltaPercent) }), icon: kpi.key === "visits" ? (_jsx(TrendingUp, { className: "size-4 opacity-70" })) : kpi.key === "newUsers" ? (_jsx(Users2, { className: "size-4 opacity-70" })) : kpi.key === "orders" ? (_jsx(ShoppingBag, { className: "size-4 opacity-70" })) : (_jsx(Ticket, { className: "size-4 opacity-70" })) }, kpi.key))) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "size-4" }), " ", t("chart.weeklyPerformance")] }), _jsx(Badge, { variant: "secondary", children: t("realtime") })] }), _jsx(CardContent, { children: _jsx("div", { className: "muted-surface rounded-[var(--radius)] p-10 text-center text-sm text-muted-foreground", children: t("chart.placeholder") }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: t("activity.recent") }) }), _jsx(CardContent, { className: "space-y-4", children: recentActivities.map((item, idx) => {
                                    if (item.type === "userSignedUp") {
                                        return (_jsxs("div", { children: [_jsx(ActivityRow, { title: t("activity.userSignedUp"), meta: t("time.minutesAgo", { value: item.minutesAgo }) }), _jsx(Separator, {})] }, idx));
                                    }
                                    if (item.type === "orderCreated") {
                                        return (_jsxs("div", { children: [_jsx(ActivityRow, { title: t("activity.orderCreated", { orderId: item.orderId }), meta: t("time.minutesAgo", { value: item.minutesAgo }) }), _jsx(Separator, {})] }, idx));
                                    }
                                    return (_jsx("div", { children: _jsx(ActivityRow, { title: t("activity.ticketAnswered", { ticketId: item.ticketId }), meta: t("time.hoursAgo", { value: item.hoursAgo }) }) }, idx));
                                }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: t("quickActions") }) }), _jsxs(CardContent, { className: "flex flex-wrap gap-2", children: [_jsxs(Button, { className: "bg-primary text-primary-foreground hover:bg-primary/90", children: [_jsx(FileText, { className: "size-4 ms-1" }), " ", t("actions.generateReport")] }), _jsxs(Button, { variant: "outline", children: [_jsx(UserPlus, { className: "size-4 ms-1" }), " ", t("actions.addUser")] }), _jsxs(Button, { variant: "secondary", children: [_jsx(Settings, { className: "size-4 ms-1" }), " ", t("actions.settings")] })] })] })] }));
}
function ActivityRow({ title, meta }) {
    const { t } = useI18n();
    return (_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx(H3, { className: "text-base mb-1", children: title }), _jsx(Small, { className: "text-muted-foreground", children: meta })] }), _jsx(Badge, { variant: "secondary", children: t("activity.new") })] }));
}
