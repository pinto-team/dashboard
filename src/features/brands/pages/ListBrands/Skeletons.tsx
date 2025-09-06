// features/brands/pages/ListBrands/Skeletons.tsx
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function BrandsBodySkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-7 w-44" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>

            <Separator className="mx-4 lg:mx-6" />

            <div className="px-4 lg:px-6">
                <div className="rounded-xl border p-3">
                    <table className="w-full">
                        <thead>
                        <tr>
                            {["1", "2", "3", "4"].map((k) => (
                                <th key={k} className="p-3 text-left">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {[...Array(8)].map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3"><Skeleton className="h-4 w-40" /></td>
                                <td className="p-3"><Skeleton className="h-4 w-28" /></td>
                                <td className="p-3"><Skeleton className="h-10 w-10 rounded-md" /></td>
                                <td className="p-3"><Skeleton className="h-8 w-24" /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <div className="flex flex-col items-center gap-3 p-3 sm:flex-row sm:justify-between">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}
