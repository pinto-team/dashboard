import * as React from "react"
import { useMemo } from "react"
import {
    ChevronDown,
    CircleUser,
    DollarSignIcon,
    NotebookIcon,
    Settings as SettingsIcon,
    ShoppingBagIcon,
    Store,
    Truck,
    Warehouse,
} from "lucide-react"
import { IconInnerShadowTop } from "@tabler/icons-react"

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavUser } from "@/components/nav-user"
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

const itemsSchema: MenuItem[] = [
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
    { titleKey: "menu.finance", icon: DollarSignIcon, children: [
            { titleKey: "menu.finance.dailySales", url: "#finance-daily-sales" },
            { titleKey: "menu.finance.logisticsCosts", url: "#finance-logistics-costs" },
        ]},
    { titleKey: "menu.reports", icon: NotebookIcon, children: [
            { titleKey: "menu.reports.orders", url: "#reports-orders" },
            { titleKey: "menu.reports.topProducts", url: "#reports-top-products" },
        ]},
    { titleKey: "menu.settings", icon: SettingsIcon, children: [
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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { t, locale } = useI18n()
    // const { user } = useAuth()

    const user = {
        name: "Test User",
        email: "test@example.com",
        avatar: "/avatars/placeholder.png",
    }

    const isRTL = locale === "fa"
    const side = isRTL ? "right" : "left"

    const items = useMemo(() => translateItems(itemsSchema, t), [t])

    const navUser = {
        name: user?.name ?? user?.email?.split("@")[0] ?? "Guest",
        email: user?.email ?? "",
        avatar: (user as { avatar?: string })?.avatar,
    }

    return (
        <Sidebar collapsible="offcanvas" side={side} dir={isRTL ? "rtl" : "ltr"} {...props}>
            <SidebarHeader className="data-[slot=sidebar-menu-button]:!p-1.5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Acme Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <MenuSection label={t("appTitle")} items={items} isRTL={isRTL} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}