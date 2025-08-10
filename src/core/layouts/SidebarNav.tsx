import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export default function SidebarNav() {
    const { pathname } = useLocation();

    const Item = ({
                      to,
                      children,
                  }: {
        to: string;
        children: React.ReactNode;
    }) => {
        const active =
            (to === "/" && pathname === "/") ||
            (to !== "/" && pathname.startsWith(to));
        return (
            <Button
                asChild
                variant={active ? "secondary" : "ghost"}
                className="justify-start"
            >
                <Link to={to}>{children}</Link>
            </Button>
        );
    };

    return (
        <nav className="grid gap-1">
            <Item to="/">داشبورد</Item>
            <Item to="/login">ورود</Item>
        </nav>
    );
}
