import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function BrandsEditBodySkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-7 w-44" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>

            <Separator className="mx-4 lg:mx-6" />

            <div className="px-4 lg:px-6">
                <div className="rounded-xl border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        ))}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-24 w-24 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
