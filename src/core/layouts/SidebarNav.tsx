import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
import {
  Home,
  ShoppingCart,
  Package2,
  Users2,
  LineChart,
  LogIn as LoginIcon,
} from "lucide-react";
import {ROUTES} from "@/app/routes/routes.ts";

export default function SidebarNav() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  const items = [
    { to: ROUTES.ROOT, label: t("nav.dashboard"), icon: Home },
    { to: "/orders", label: "Orders", icon: ShoppingCart },
    { to: "/products", label: "Products", icon: Package2 },
    { to: "/customers", label: "Customers", icon: Users2 },
    { to: "/analytics", label: "Analytics", icon: LineChart },
    { to: ROUTES.LOGIN, label: t("nav.login"), icon: LoginIcon },
  ];

  return (
    <nav className="grid gap-1">
      {items.map(({ to, label, icon: Icon }) => {
        const active = (to === "/" && pathname === "/") || (to !== "/" && pathname.startsWith(to));
        return (
          <Button
            key={to}
            asChild
            variant={active ? "secondary" : "ghost"}
            className="justify-start gap-2"
          >
            <Link to={to}>
              <Icon className="size-4" />
              <span className="truncate">{label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
