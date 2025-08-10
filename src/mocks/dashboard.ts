export type KpiKey = "visits" | "newUsers" | "orders" | "tickets";

export type DashboardKpi = {
    key: KpiKey;
    value: number;
    deltaPercent: number; // positive or negative
};

export const dashboardKpis: DashboardKpi[] = [
    { key: "visits", value: 12450, deltaPercent: 12 },
    { key: "newUsers", value: 1248, deltaPercent: 5 },
    { key: "orders", value: 328, deltaPercent: -3 },
    { key: "tickets", value: 57, deltaPercent: 2 },
];

export type RecentActivity =
    | { type: "userSignedUp"; minutesAgo: number }
    | { type: "orderCreated"; minutesAgo: number; orderId: number }
    | { type: "ticketAnswered"; hoursAgo: number; ticketId: number };

export const recentActivities: RecentActivity[] = [
    { type: "userSignedUp", minutesAgo: 2 },
    { type: "orderCreated", minutesAgo: 10, orderId: 4392 },
    { type: "ticketAnswered", hoursAgo: 1, ticketId: 981 },
];