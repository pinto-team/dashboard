import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
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

    return <DashboardLayout>{renderContent()}</DashboardLayout>
}
