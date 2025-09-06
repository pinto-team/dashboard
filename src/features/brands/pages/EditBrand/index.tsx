import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { BrandsEditBodySkeleton } from "./Skeletons"
import ErrorFallback from "@/components/layout/ErrorFallback"
import EditBrandUI from "./Ui"
import { useEditBrandContainer } from "./Container"

export default function EditBrandPage() {
    const { status, ui, data, actions } = useEditBrandContainer()

    const renderContent = () => {
        if (status.isLoading) return <BrandsEditBodySkeleton />
        if (status.isError) {
            return <ErrorFallback error={status.error} onRetry={actions.refetch} />
        }

        return (
            <EditBrandUI
                title={ui.title}
                isSaving={status.isSaving}
                isBusy={status.isBusy}
                rtl={ui.rtl}
                onBack={actions.goBack}
                onRequestDelete={actions.onRequestDelete}
                onConfirmDelete={actions.onConfirmDelete}
                deleteOpen={actions.deleteOpen}
                setDeleteOpen={actions.setDeleteOpen}
                onSubmit={actions.submit}
                formDefaults={data.formDefaults}
                initialLogoUrl={data.initialLogoUrl}
                apiErrors={data.apiErrors}
                labels={ui.labels}
            />
        )
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing)*72)",
                    "--header-height": "calc(var(--spacing)*12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {renderContent()}
            </SidebarInset>
        </SidebarProvider>
    )
}
