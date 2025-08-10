import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { Small } from "@/shared/components/typography";
import { cn } from "@/lib/utils";

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
