import React, { useMemo } from "react"
import {
    ChevronDown,
    ChevronUp,
    CircleUser,
    DollarSignIcon,
    NotebookIcon,
    Settings,
    ShoppingBagIcon,
    Store,
    Truck,
    User2,
    Warehouse,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useI18n } from "@/shared/hooks/useI18n"
import { useAuth } from "@/app/providers/useAuth"

type TranslateFn = (key: string) => string

type MenuChild = {
    titleKey: string
    url: string
}

type MenuItem = {
    titleKey: string
    url?: string
    icon: React.ComponentType<{ className?: string }>
    children?: MenuChild[]
}

const itemsSchema1: MenuItem[] = [
    { titleKey: "menu.orders", icon: ShoppingBagIcon, children: [
            { titleKey: "menu.orders.active", url: "#orders-active" },
            { titleKey: "menu.orders.history", url: "#orders-history" },
        ]},
    { titleKey: "menu.store", icon: Store, children: [
            { titleKey: "menu.store.restaurants", url: "#store-restaurants" },
            { titleKey: "menu.store.supermarket", url: "#store-supermarket" },
        ]},
    { titleKey: "menu.pinto", icon: Warehouse, children: [
            { titleKey: "menu.pinto.max", url: "#pinto-max" },
            { titleKey: "menu.pinto.eco", url: "#pinto-eco" },
            { titleKey: "menu.pinto.pro", url: "#pinto-pro" },
        ]},
    { titleKey: "menu.users", icon: CircleUser, children: [
            { titleKey: "menu.users.customers", url: "#users-customers" },
            { titleKey: "menu.users.admins", url: "#users-admins" },
        ]},
    { titleKey: "menu.logistics", icon: Truck, children: [
            { titleKey: "menu.logistics.motorcycle", url: "#logistics-motorcycle" },
            { titleKey: "menu.logistics.van", url: "#logistics-van" },
        ]},
]

const itemsSchema2: MenuItem[] = [
    { titleKey: "menu.finance", icon: DollarSignIcon, children: [
            { titleKey: "menu.finance.dailySales", url: "#finance-daily-sales" },
            { titleKey: "menu.finance.logisticsCosts", url: "#finance-logistics-costs" },
        ]},
    { titleKey: "menu.reports", icon: NotebookIcon, children: [
            { titleKey: "menu.reports.orders", url: "#reports-orders" },
            { titleKey: "menu.reports.topProducts", url: "#reports-top-products" },
        ]},
    { titleKey: "menu.settings", icon: Settings, children: [
            { titleKey: "menu.settings.shippingRate", url: "#settings-shipping-rate" },
            { titleKey: "menu.settings.addProducts", url: "#settings-add-products" },
        ]},
]

const translateItems = (items: MenuItem[], t: TranslateFn) =>
    items.map((item) => ({
        ...item,
        title: t(item.titleKey),
        children: item.children?.map((child) => ({ ...child, title: t(child.titleKey) })) ?? [],
    }))

const alignClass = (isRTL: boolean) => (isRTL ? "text-right" : "text-left")

function MenuSection({ label, items, isRTL }: { label: string; items: ReturnType<typeof translateItems>; isRTL: boolean }) {
    const align = alignClass(isRTL)
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <Collapsible key={item.title} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className={`w-full ${align}`}>
                                        <item.icon />
                                        <span className="flex-1 text-black">{item.title}</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {item.children.length > 0 && (
                                    <CollapsibleContent className="data-[state=closed]:hidden">
                                        <SidebarMenuSub>
                                            {item.children.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.url}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.url} className={`w-full ${align}`}>
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export function AppSidebar() {
    const { t, locale } = useI18n()
    const { user, logout } = useAuth()

    const isRTL = locale === "fa"
    const side = isRTL ? "right" : "left"

    const items1 = useMemo(() => translateItems(itemsSchema1, t), [t])
    const items2 = useMemo(() => translateItems(itemsSchema2, t), [t])

    return (
        <Sidebar collapsible="icon" side={side}>
            <SidebarHeader className="flex flex-col gap-2 p-2 border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <span className="text-3xl font-black">Acme Inc.</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <MenuSection label={t("appTitle")} items={items1} isRTL={isRTL} />
                <MenuSection label="Morteza Group" items={items2} isRTL={isRTL} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <User2 /> {user?.email ?? "Guest"}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>{t("sidebar.account")}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>{user?.email ?? "-"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <span>{t("sidebar.signOut")}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
