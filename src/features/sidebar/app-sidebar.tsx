import { IconInnerShadowTop } from "@tabler/icons-react";
import { ChevronDown, Settings as SettingsIcon, UserCog } from "lucide-react";



import * as React from "react";
import { useMemo } from "react";



import { NavLink } from "react-router-dom";



import { ROUTES } from "@/app/routes/routes";
import { NavUser } from "@/components/layout/nav-user";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useI18n } from "@/shared/hooks/useI18n";
import { getSidebarSide, isRTLLocale } from "@/shared/i18n/utils";





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
    {
        titleKey: "menu.basic",
        icon: SettingsIcon,
        children: [
            { titleKey: "menu.basic.brand", url: ROUTES.BRAND.LIST },
            { titleKey: "menu.basic.category", url: ROUTES.CATEGORY.LIST },
            { titleKey: "menu.basic.product", url: ROUTES.PRODUCT.LIST },
        ],
    },
    {
        titleKey: "menu.settings",
        icon: UserCog,
        children: [{ titleKey: "menu.settings.sessions", url: ROUTES.SETTINGS.SESSIONS }],
    },
]

const translateItems = (items: MenuItem[], t: TranslateFn) =>
    items.map((item) => ({
        ...item,
        title: t(item.titleKey),
        children:
            item.children?.map((child) => ({ ...child, title: t(child.titleKey) })) ??
            [],
    }))

function MenuSection({
                         label,
                         items,
                     }: {
    label: string
    items: ReturnType<typeof translateItems>
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-start">
                {label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) =>
                        item.children.length > 0 ? (
                            <Collapsible key={item.titleKey} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="w-full flex items-center text-sidebar-foreground text-start">
                                            <item.icon className="shrink-0 me-2" />
                                            <span className="flex-1">{item.title}</span>
                                            <ChevronDown className="ms-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 rtl:-scale-x-100" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="data-[state=closed]:hidden">
                                        {/* نکته: مرز راهنما برای LTR از چپ و برای RTL از راست */}
                                        <SidebarMenuSub className="border-border ltr:border-l rtl:border-r ltr:border-r-0 rtl:border-l-0 ltr:pl-3 rtl:pr-3">
                                            {item.children.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={`${item.titleKey}-${subItem.url}`}
                                                >
                                                    <SidebarMenuSubButton asChild className="w-full">
                                                        <NavLink
                                                            to={subItem.url}
                                                            className="w-full text-sidebar-foreground/90 hover:text-sidebar-foreground text-start ltr:ps-6 rtl:pe-6"
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </NavLink>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.titleKey}>
                                <SidebarMenuButton
                                    asChild
                                    className="w-full flex items-center text-sidebar-foreground text-start"
                                >
                                    <NavLink to={item.url ?? "#"}>
                                        <item.icon className="shrink-0 me-2" />
                                        <span className="flex-1">{item.title}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { t, locale } = useI18n()
    const { user: authUser, logout } = useAuth()

    const user = authUser
        ? {
              name: `${authUser.firstName} ${authUser.lastName}`.trim() || authUser.username,
              email: authUser.email,
              avatar: authUser.avatar ?? '/avatars/placeholder.png',
          }
        : {
              name: t('user.guest'),
              email: '',
              avatar: '/avatars/placeholder.png',
          }

    const isRTL = isRTLLocale(locale)
    const side = getSidebarSide(locale)
    const items = useMemo(() => translateItems(itemsSchema, t), [t])

    return (
        <Sidebar
            collapsible="offcanvas"
            side={side}
            dir={isRTL ? "rtl" : "ltr"}
            {...props}
        >
            <SidebarHeader className="data-[slot=sidebar-menu-button]:!p-1.5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-sidebar-foreground">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5 me-2" />
                                <span className="text-base font-semibold">
                  {t("app.title")}
                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <MenuSection label={t("app.title")} items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} onLogout={logout} />
            </SidebarFooter>
        </Sidebar>
    )
}
