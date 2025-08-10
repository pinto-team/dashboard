import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { H3, Small } from "@/shared/components/typography";
import { useI18n } from "@/shared/hooks/useI18n";
import { dashboardKpis, recentActivities } from "@/mocks/dashboard";
import { formatNumber } from "@/shared/i18n/numbers";
import {
  BarChart3,
  DollarSign,
  Users2,
  CreditCard,
  Activity,
  FileText,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  const { t, locale } = useI18n();

  return (
    <div className="grid gap-6">
      {/* Header actions */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("dashboard")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="size-4 ms-1" /> {t("actions.createReport")}
          </Button>
          <Button variant="secondary">
            <Settings className="size-4 ms-1" /> {t("actions.settings")}
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <Card key={kpi.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(`kpi.${kpi.key}`)}
              </CardTitle>
              {kpi.key === "visits" ? (
                <Activity className="size-4 text-muted-foreground" />
              ) : kpi.key === "newUsers" ? (
                <Users2 className="size-4 text-muted-foreground" />
              ) : kpi.key === "orders" ? (
                <CreditCard className="size-4 text-muted-foreground" />
              ) : (
                <DollarSign className="size-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(kpi.value, locale)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.deltaPercent >= 0
                  ? t("kpi.delta.positive", { value: kpi.deltaPercent })
                  : t("kpi.delta.negative", { value: Math.abs(kpi.deltaPercent) })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4" /> Overview
            </CardTitle>
            <Badge variant="secondary">{t("realtime")}</Badge>
          </CardHeader>
          <CardContent>
            <div className="muted-surface rounded-[var(--radius)] p-10 text-center text-sm text-muted-foreground">
              {t("chart.placeholder")}
            </div>
          </CardContent>
        </Card>

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

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("quickActions")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="size-4 ms-1" /> {t("actions.generateReport")}
          </Button>
          <Button variant="outline">
            <Users2 className="size-4 ms-1" /> {t("actions.addUser")}
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
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <H3 className="text-base mb-1">{title}</H3>
        <Small className="text-muted-foreground">{meta}</Small>
      </div>
      <Badge variant="secondary">New</Badge>
    </div>
  );
}
