import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
export function StatCard({ title, value, sub }) {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base", children: title }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: value }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: sub })] })] }));
}
