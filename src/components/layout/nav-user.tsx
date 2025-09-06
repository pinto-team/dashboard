import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"
import { useEffect } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useI18n } from "@/shared/hooks/useI18n"
import { getTextDirection } from "@/shared/i18n/utils"
import { getInitials } from "@/shared/utils/getInitials"

type Props = {
    user: {
        name: string
        email: string
        avatar: string
    }
    onLogout?: () => void
}

export function NavUser({ user, onLogout }: Props) {
    const { isMobile } = useSidebar()
    const { t, locale } = useI18n()

    // Manage scrollbar compensation
    useEffect(() => {
        const handleOpen = () => document.body.classList.add("overflow-hidden")
        const handleClose = () => document.body.classList.remove("overflow-hidden")

        const trigger = document.querySelector(
            "[data-radix-dropdown-menu-trigger]"
        )
        trigger?.addEventListener("click", handleOpen)
        document.addEventListener("click", (e) => {
            if (!trigger?.contains(e.target as Node)) {
                handleClose()
            }
        })

        return () => {
            trigger?.removeEventListener("click", handleOpen)
            document.removeEventListener("click", handleClose)
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
                            className="flex items-center justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                            </div>
                            <IconDotsVertical className="ms-auto size-4 rtl:-scale-x-100" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="min-w-56 rounded-lg text-start"
                        side={isMobile ? "bottom" : "right"}
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
                                    <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconUserCircle className="h-4 w-4 rtl:-scale-x-100" />
                                {t("sidebar.account")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconCreditCard className="h-4 w-4 rtl:-scale-x-100" />
                                {t("sidebar.billing")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2">
                                <IconNotification className="h-4 w-4 rtl:-scale-x-100" />
                                {t("sidebar.notifications")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={onLogout}
                            className="flex items-center gap-x-2"
                        >
                            <IconLogout className="h-4 w-4 rtl:-scale-x-100" />
                            {t("sidebar.signOut")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
