import { Card, CardHeader, CardContent } from "@/components/ui/card.tsx";
import { Small } from "@/components/typography.tsx";
import { cn } from "@/lib/utils.ts";

export default function StatCard({
                                     label,
                                     value,
                                     delta,
                                     className,
                                     icon,
                                 }: {
    label: string;
    value: string;
    delta?: string;
    className?: string;
    icon?: React.ReactNode;
}) {
    return (
        <Card className={cn("rounded-[var(--radius)]", className)}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <Small className="text-muted-foreground">{label}</Small>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {delta ? <div className="text-xs text-muted-foreground mt-1">{delta}</div> : null}
            </CardContent>
        </Card>
    );
}
