import {Calendar, ChevronDown, ChevronUp, Home, Inbox, Plus, Search, Settings, User2} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,

} from "@/components/ui/sidebar"

// اگر از shadcn/ui استفاده می‌کنی:
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Menu items + children (ساب‌منوها)
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
        children: [
            { title: "Overview", url: "#home-overview" },
            { title: "Updates", url: "#home-updates" },
            { title: "Quick actions", url: "#home-actions" },
        ],
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        children: [
            { title: "All", url: "#inbox-all" },
            { title: "Unread", url: "#inbox-unread" },
            { title: "Assigned to me", url: "#inbox-me" },
        ],
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
        children: [
            { title: "Month", url: "#calendar-month" },
            { title: "Week", url: "#calendar-week" },
            { title: "Day", url: "#calendar-day" },
        ],
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
        children: [
            { title: "All", url: "#search-all" },
            { title: "People", url: "#search-people" },
            { title: "Messages", url: "#search-messages" },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
        children: [
            { title: "Profile", url: "#settings-profile" },
            { title: "Team", url: "#settings-team" },
            { title: "Billing", url: "#settings-billing" },
        ],
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Stores</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <Collapsible key={item.title} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full">
                                                <item.icon />
                                                <span className="flex-1">{item.title}</span>
                                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        {item.children?.length ? (
                                            <CollapsibleContent className="data-[state=closed]:hidden">
                                                <SidebarMenuSub>
                                                    {item.children.map((sub) => (
                                                        <SidebarMenuSubItem key={sub.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={sub.url}>
                                                                    <span>{sub.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        ) : null}
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Orders</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus /> <span className="sr-only">Add Project</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
