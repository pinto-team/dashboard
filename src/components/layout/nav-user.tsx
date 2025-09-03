import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from '@tabler/icons-react'

import { useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { getTextDirection } from '@/shared/i18n/utils.ts'
import { getInitials } from '@/shared/utils/getInitials.ts'

export function NavUser({
    user,
    onLogout,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
    onLogout?: () => void
}) {
    const { isMobile } = useSidebar()
    const { t, locale } = useI18n()

    // Manage scrollbar compensation
    useEffect(() => {
        const handleOpen = () => {
            document.body.classList.add('overflow-hidden')
        }
        const handleClose = () => {
            document.body.classList.remove('overflow-hidden')
        }

        // Add event listeners for dropdown open/close
        const trigger = document.querySelector('[data-radix-dropdown-menu-trigger]')
        trigger?.addEventListener('click', handleOpen)
        document.addEventListener('click', (e) => {
            if (!trigger?.contains(e.target as Node)) {
                handleClose()
            }
        })

        return () => {
            trigger?.removeEventListener('click', handleOpen)
            document.removeEventListener('click', handleClose)
            handleClose()
        }
    }, [])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <IconDotsVertical className="ms-auto size-4 rtl:-scale-x-100" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-start"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                        style={{ direction: getTextDirection(locale) }}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-x-2 ps-2 py-1.5 text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-start text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconUserCircle className="w-4 h-4 rtl:-scale-x-100" />
                                {t('sidebar.account')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconCreditCard className="w-4 h-4 rtl:-scale-x-100" />
                                {t('sidebar.billing')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconNotification className="w-4 h-4 rtl:-scale-x-100" />
                                {t('sidebar.notifications')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout} className="flex items-center gap-x-2">
                            <IconLogout className="w-4 h-4 rtl:-scale-x-100" />
                            {t('sidebar.signOut')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
