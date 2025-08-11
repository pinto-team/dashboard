import { Link } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Plus,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Items with translation keys
const items = [
  { titleKey: "nav.dashboard", to: "/", icon: Home },
  { titleKey: "nav.inbox", to: "#", icon: Inbox },
  { titleKey: "nav.calendar", to: "#", icon: Calendar },
  { titleKey: "nav.search", to: "#", icon: Search },
  { titleKey: "nav.settings", to: "#", icon: Settings },
];

export default function AppSidebar() {
  const { locale, t } = useI18n();
  const side: "left" | "right" = locale === "fa" ? "right" : "left";

  return (
    <Sidebar side={side} collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {t("appTitle")}
                  <ChevronDown className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.application")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)} isActive={item.to === "/"}>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction title="More">
                    <MoreHorizontal />
                  </SidebarMenuAction>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel asChild>{t("sidebar.projects")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton>
                    <span>{t("sidebar.projectX", { value: i + 1 })}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronDown className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>{t("sidebar.account")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t("sidebar.billing")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t("sidebar.signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}