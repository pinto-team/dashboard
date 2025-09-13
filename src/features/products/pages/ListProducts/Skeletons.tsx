import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductsTableSkeleton() {
  return (
    <div className="rounded-xl border p-3">
      <table className="w-full">
        <thead>
          <tr>
            {['1', '2', '3', '4'].map((k) => (
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
              <td className="p-3"><Skeleton className="h-4 w-20" /></td>
              <td className="p-3"><Skeleton className="h-8 w-24" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProductsPaginationSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-3 sm:flex-row sm:justify-between">
      <Skeleton className="h-4 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
