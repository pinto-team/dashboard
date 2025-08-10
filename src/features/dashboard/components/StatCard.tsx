import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            </CardContent>
        </Card>
    );
}
