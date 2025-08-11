import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {AppSidebar} from "@/core/sidebar/components/app-sidebar.tsx"

export default function SideBarLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main>
                <SidebarTrigger/>
            </main>
        </SidebarProvider>
    )
}