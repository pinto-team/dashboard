import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { SessionRecord } from "@/features/sessions/model/types"

type DetailGroup = {
    key: string
    title: string
    items: { key: string; label: string; value: string }[]
}

interface SessionDetailsSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedSession: SessionRecord | null
    detailGroups: DetailGroup[]
    buildDisplayName: (session: SessionRecord) => string
    t: (key: string) => string
    isRTL?: boolean
    onRevokeSelected: () => void
    isRevokingSelected: boolean
}

export function SessionDetailsSheet({
                                        open,
                                        onOpenChange,
                                        selectedSession,
                                        detailGroups,
                                        buildDisplayName,
                                        t,
                                        isRTL = false,
                                        onRevokeSelected,
                                        isRevokingSelected,
                                    }: SessionDetailsSheetProps) {
    const detailSheetSide = isRTL ? "left" : "right"

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={detailSheetSide}
                className="flex flex-col w-full h-full gap-0 p-0 sm:max-w-md"
            >
                {/* Header */}
                <SheetHeader className="gap-1.5 border-b p-6">
                    <SheetTitle className="text-lg font-semibold">
                        {t("sessions.details.title")}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        {selectedSession
                            ? buildDisplayName(selectedSession)
                            : t("sessions.details.empty")}
                    </p>
                </SheetHeader>

                {/* Scrollable content */}
                <ScrollArea className="flex-1 px-6 py-5 max-h-[calc(100vh-200px)]">
                    {selectedSession ? (
                        <div className="space-y-6">
                            {detailGroups.map((group) => (
                                <section key={group.key} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            {group.title}
                                        </h3>
                                        <span className="h-px flex-1 bg-border/70" />
                                    </div>
                                    <dl className="grid gap-3 sm:grid-cols-2">
                                        {group.items.map((item) => (
                                            <div
                                                key={item.key}
                                                className="rounded-lg border border-border/60 bg-muted/40 p-3"
                                            >
                                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    {item.label}
                                                </dt>
                                                <dd className="mt-1 break-words text-sm font-semibold leading-snug text-foreground">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
                            {t("sessions.details.empty")}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                <SheetFooter className="border-t bg-muted/40 px-6 py-4">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="sm:min-w-[140px]"
                        >
                            {t("sessions.actions.close")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onRevokeSelected}
                            disabled={!selectedSession || isRevokingSelected}
                            className="sm:min-w-[180px]"
                        >
                            {isRevokingSelected ? (
                                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                                    {t("sessions.actions.revoke_selected_in_progress")}
                </span>
                            ) : selectedSession?.is_current ? (
                                t("sessions.actions.revoke_current")
                            ) : (
                                t("sessions.actions.revoke_selected")
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
