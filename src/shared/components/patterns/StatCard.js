import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { Small } from "@/shared/components/typography";
import { cn } from "@/lib/utils";
export default function StatCard({ label, value, delta, className, icon, }) {
    return (_jsxs(Card, { className: cn("rounded-[var(--radius)]", className), children: [_jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between", children: [_jsx(Small, { className: "text-muted-foreground", children: label }), icon] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: value }), delta ? _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: delta }) : null] })] }));
}
