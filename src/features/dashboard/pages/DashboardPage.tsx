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

    return (
        <div className="grid gap-6">
            {/* Header سکشن با اکشن‌ها */}
            <PageHeader
                title={t("dashboard")}
                subtitle={t("dashboard.subtitle")}
                actions={
                    <>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <FileText className="size-4 ms-1" /> {t("actions.createReport")}
                        </Button>
                        <Button variant="secondary">
                            <Settings className="size-4 ms-1" /> {t("actions.settings")}
                        </Button>
                    </>
                }
            />

            {/* KPI ها */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardKpis.map((kpi) => (
                    <StatCard
                        key={kpi.key}
                        label={t(`kpi.${kpi.key}`)}
                        value={formatNumber(kpi.value, locale)}
                        delta={
                            kpi.deltaPercent >= 0
                                ? t("kpi.delta.positive", { value: kpi.deltaPercent })
                                : t("kpi.delta.negative", { value: Math.abs(kpi.deltaPercent) })
                        }
                        icon={
                            kpi.key === "visits" ? (
                                <TrendingUp className="size-4 opacity-70" />
                            ) : kpi.key === "newUsers" ? (
                                <Users2 className="size-4 opacity-70" />
                            ) : kpi.key === "orders" ? (
                                <ShoppingBag className="size-4 opacity-70" />
                            ) : (
                                <Ticket className="size-4 opacity-70" />
                            )
                        }
                    />
                ))}
            </div>

            {/* بخش محتوای نمونه: چارت / فعالیت اخیر / اقدامات سریع */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Placeholder چارت */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="size-4" /> {t("chart.weeklyPerformance")}
                        </CardTitle>
                        <Badge variant="secondary">{t("realtime")}</Badge>
                    </CardHeader>
                    <CardContent>
                        {/* اینجا بعداً می‌تونیم recharts بذاریم */}
                        <div className="muted-surface rounded-[var(--radius)] p-10 text-center text-sm text-muted-foreground">
                            {t("chart.placeholder")}
                        </div>
                    </CardContent>
                </Card>

                {/* فعالیت اخیر */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("activity.recent")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivities.map((item, idx) => {
                            if (item.type === "userSignedUp") {
                                return (
                                    <div key={idx}>
                                        <ActivityRow
                                            title={t("activity.userSignedUp")}
                                            meta={t("time.minutesAgo", { value: item.minutesAgo })}
                                        />
                                        <Separator />
                                    </div>
                                );
                            }
                            if (item.type === "orderCreated") {
                                return (
                                    <div key={idx}>
                                        <ActivityRow
                                            title={t("activity.orderCreated", { orderId: item.orderId })}
                                            meta={t("time.minutesAgo", { value: item.minutesAgo })}
                                        />
                                        <Separator />
                                    </div>
                                );
                            }
                            return (
                                <div key={idx}>
                                    <ActivityRow
                                        title={t("activity.ticketAnswered", { ticketId: item.ticketId })}
                                        meta={t("time.hoursAgo", { value: item.hoursAgo })}
                                    />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* اقدامات سریع */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("quickActions")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <FileText className="size-4 ms-1" /> {t("actions.generateReport")}
                    </Button>
                    <Button variant="outline">
                        <UserPlus className="size-4 ms-1" /> {t("actions.addUser")}
                    </Button>
                    <Button variant="secondary">
                        <Settings className="size-4 ms-1" /> {t("actions.settings")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function ActivityRow({ title, meta }: { title: string; meta: string }) {
    const { t } = useI18n();
    return (
        <div className="flex items-start justify-between gap-3">
            <div>
                <H3 className="text-base mb-1">{title}</H3>
                <Small className="text-muted-foreground">{meta}</Small>
            </div>
            <Badge variant="secondary">{t("activity.new")}</Badge>
        </div>
    );
}
