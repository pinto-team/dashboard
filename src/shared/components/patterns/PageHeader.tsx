import { H1, Lead } from "@/shared/components/typography";
import { cn } from "@/lib/utils";

export default function PageHeader({
                                       title,
                                       subtitle,
                                       className,
                                       actions,
                                   }: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("surface p-5 md:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", className)}>
            <div>
                <H1 className="mb-1">{title}</H1>
                {subtitle ? <Lead>{subtitle}</Lead> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
    );
}
