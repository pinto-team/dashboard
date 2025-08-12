import {
    Calendar,
    ChevronDown,
    ChevronUp, CircleUser,
    DollarSignIcon,
    Home,
    Inbox,
    NotebookIcon,
    Plus,
    Settings, ShoppingBagIcon, Store, Truck,
    User2, Warehouse
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
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
    DropdownMenuTrigger,}
    from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,}
    from "@/components/ui/collapsible"
import {useI18n} from "@/shared/hooks/useI18n";
import {useAuth} from "@/app/providers/useAuth";

const buildItems1 = (t: (k: string) => string) => [
    {
        title: t("menu.orders"),
        url: "#",
        icon: ShoppingBagIcon,
        children: [
            {title: t("menu.orders.active"), url: "#orders-active"},
            {title: t("menu.orders.history"), url: "#orders-history"},
        ],
    },
    {
        title: t("menu.store"),
        url: "#",
        icon: Store,
        children: [
            {title: t("menu.store.restaurants"), url: "#store-restaurants"},
            {title: t("menu.store.supermarket"), url: "#store-supermarket"},
        ],
    },
    {
        title: t("menu.pinto"),
        url: "#",
        icon: Warehouse,
        children: [
            {title: t("menu.pinto.max"), url: "#pinto-max"},
            {title: t("menu.pinto.eco"), url: "#pinto-eco"},
            {title: t("menu.pinto.pro"), url: "#pinto-pro"},
        ],
    },
    {
        title: t("menu.users"),
        url: "#",
        icon: CircleUser,
        children: [
            {title: t("menu.users.customers"), url: "#users-customers"},
            {title: t("menu.users.admins"), url: "#users-admins"},
        ],
    },
    {
        title: t("menu.logistics"),
        url: "#",
        icon: Truck,
        children: [
            {title: t("menu.logistics.motorcycle"), url: "#logistics-motorcycle"},
            {title: t("menu.logistics.van"), url: "#logistics-van"},
        ],
    }
]

const buildItems2 = (t: (k: string) => string) => [
    {
        title: t("menu.finance"),
        url: "#",
        icon: DollarSignIcon,
        children: [
            {title: t("menu.finance.dailySales"), url: "#finance-daily-sales"},
            {title: t("menu.finance.logisticsCosts"), url: "#finance-logistics-costs"},
        ],
    },
    {
        title: t("menu.reports"),
        url: "#",
        icon: NotebookIcon,
        children: [
            {title: t("menu.reports.orders"), url: "#reports-orders"},
            {title: t("menu.reports.topProducts"), url: "#reports-top-products"},
        ],
    },
    {
        title: t("menu.settings"),
        url: "#",
        icon: Settings,
        children: [
            {title: t("menu.settings.shippingRate"), url: "#settings-shipping-rate"},
            {title: t("menu.settings.addProducts"), url: "#settings-add-products"},
        ],
    },
]

export function AppSidebar() {
    const {t, locale} = useI18n();
    const {user, logout} = useAuth();
    const side = locale === "fa" ? "right" : "left";
    const dirClass = locale === "fa" ? "rtl" : "ltr";
    const items1 = buildItems1(t);
    const items2 = buildItems2(t);

    return (
        <Sidebar collapsible="icon" side={side}>
            <SidebarHeader className={"flex flex-col gap-2 p-2 border-b"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <span className="text-3xl font-black">Acme Inc.</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("appTitle")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items1.map((item) => (
                                <Collapsible key={item.title} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className={`w-full ${dirClass === "rtl" ? "text-right" : "text-left"}`}>
                                                <item.icon/>
                                                <span className="flex-1 text-black">{item.title}</span>
                                                <ChevronDown
                                                    className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        {item.children?.length ? (
                                            <CollapsibleContent className="data-[state=closed]:hidden">
                                                <SidebarMenuSub>
                                                    {item.children.map((sub) => (
                                                        <SidebarMenuSubItem key={sub.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={sub.url}
                                                                   className={dirClass === "rtl" ? "text-right w-full" : "text-left w-full"}>
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
                    <SidebarGroupLabel>Morteza Group</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items2.map((item) => (
                                <Collapsible key={item.title} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className={`w-full ${dirClass === "rtl" ? "text-right" : "text-left"}`}>
                                                <item.icon/>
                                                <span className="flex-1 text-black">{item.title}</span>
                                                <ChevronDown
                                                    className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        {item.children?.length ? (
                                            <CollapsibleContent className="data-[state=closed]:hidden">
                                                <SidebarMenuSub>
                                                    {item.children.map((sub) => (
                                                        <SidebarMenuSubItem key={sub.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={sub.url}
                                                                   className={dirClass === "rtl" ? "text-right w-full" : "text-left w-full"}>
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
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <User2/> {user?.email ?? "Guest"}
                                    <ChevronUp className="ml-auto"/>
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
