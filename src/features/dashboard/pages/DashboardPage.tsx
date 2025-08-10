import PageHeader from "@/shared/components/patterns/PageHeader";
import StatCard from "@/shared/components/patterns/StatCard";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { H3, Small } from "@/shared/components/typography";

import { BarChart3, UserPlus, FileText, Settings, TrendingUp, Users2, ShoppingBag, Ticket } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="grid gap-6">
            {/* Header سکشن با اکشن‌ها */}
            <PageHeader
                title="داشبورد"
                subtitle="مرور سریع وضعیت امروز"
                actions={
                    <>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <FileText className="size-4 ms-1" /> ساخت گزارش
                        </Button>
                        <Button variant="secondary">
                            <Settings className="size-4 ms-1" /> تنظیمات
                        </Button>
                    </>
                }
            />

            {/* KPI ها */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="بازدیدها" value="12,450" delta="+12% نسبت به هفته قبل" icon={<TrendingUp className="size-4 opacity-70" />} />
                <StatCard label="کاربران جدید" value="1,248" delta="+5% نسبت به هفته قبل" icon={<Users2 className="size-4 opacity-70" />} />
                <StatCard label="سفارش‌ها" value="328" delta="-3% نسبت به هفته قبل" icon={<ShoppingBag className="size-4 opacity-70" />} />
                <StatCard label="تیکت‌ها" value="57" delta="+2% نسبت به هفته قبل" icon={<Ticket className="size-4 opacity-70" />} />
            </div>

            {/* بخش محتوای نمونه: چارت / فعالیت اخیر / اقدامات سریع */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Placeholder چارت */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="size-4" /> عملکرد هفتگی
                        </CardTitle>
                        <Badge variant="secondary">Real-time</Badge>
                    </CardHeader>
                    <CardContent>
                        {/* اینجا بعداً می‌تونیم recharts بذاریم */}
                        <div className="muted-surface rounded-[var(--radius)] p-10 text-center text-sm text-muted-foreground">
                            (اینجا چارت میاد)
                        </div>
                    </CardContent>
                </Card>

                {/* فعالیت اخیر */}
                <Card>
                    <CardHeader>
                        <CardTitle>فعالیت اخیر</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ActivityRow title="ثبت‌نام کاربر جدید" meta="2 دقیقه پیش" />
                        <Separator />
                        <ActivityRow title="سفارش #4392 ثبت شد" meta="10 دقیقه پیش" />
                        <Separator />
                        <ActivityRow title="تیکت #981 پاسخ داده شد" meta="1 ساعت پیش" />
                    </CardContent>
                </Card>
            </div>

            {/* اقدامات سریع */}
            <Card>
                <CardHeader>
                    <CardTitle>اقدامات سریع</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <FileText className="size-4 ms-1" /> ایجاد گزارش
                    </Button>
                    <Button variant="outline">
                        <UserPlus className="size-4 ms-1" /> افزودن کاربر
                    </Button>
                    <Button variant="secondary">
                        <Settings className="size-4 ms-1" /> تنظیمات
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
            <Badge variant="secondary">جدید</Badge>
        </div>
    );
}
