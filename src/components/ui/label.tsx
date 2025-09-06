import * as LabelPrimitive from '@radix-ui/react-label'

import * as React from 'react'

import { cn } from '@/lib/utils'

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    inline?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, inline = false, ...props }, ref) => {
        return (
            <LabelPrimitive.Root
                ref={ref}
                data-slot="label"
                className={cn(
                    inline
                        ? 'flex items-center gap-2 text-sm font-medium leading-none'
                        : 'block text-sm font-medium leading-tight mb-1.5',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
                    className,
                )}
                {...props}
            />
        )
    },
)

Label.displayName = 'Label'
