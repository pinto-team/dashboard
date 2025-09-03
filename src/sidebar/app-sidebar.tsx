// src/components/layout/app-sidebar.tsx
import { IconInnerShadowTop } from '@tabler/icons-react'
import { ChevronDown, Settings as SettingsIcon } from 'lucide-react'

import * as React from 'react'
import { useMemo } from 'react'

import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/app/routes/routes'
import { NavUser } from '@/components/layout/nav-user'
import {
Collapsible,
CollapsibleContent,
CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
} from '@/components/ui/sidebar'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useI18n } from '@/shared/hooks/useI18n'
import { getSidebarSide, isRTLLocale } from '@/shared/i18n/utils'

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

// ======================
// Menu Schema (raw keys)
// ======================
const itemsSchema: MenuItem[] = [
{
titleKey: 'menu.basic',
icon: SettingsIcon,
children: [
    { titleKey: 'menu.basic.category', url: ROUTES.CATEGORY.LIST },
],
},
]

// ================
// helpers
// ================
const translateItems = (items: MenuItem[], t: TranslateFn) =>
items.map((item) => ({
...item,
title: t(item.titleKey),
children: item.children?.map((child) => ({ ...child, title: t(child.titleKey) })) ?? [],
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
                            <SidebarMenuSub>
                                {item.children.map((subItem) => (
                                <SidebarMenuSubItem key={`${item.titleKey}-${subItem.url}`}>
                                    <SidebarMenuSubButton asChild>
                                        <NavLink
                                            to={subItem.url}
                                            className="w-full text-sidebar-foreground/90 hover:text-sidebar-foreground text-start ps-6"
                                        >
