import * as React from "react"
import type { Dispatch, SetStateAction } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import BrandForm from "@/features/brands/components/layout/Form/BrandForm"
import type { CreateBrandRequest } from "@/features/brands/model/types"
import { useIsRTL } from "@/shared/hooks/useIsRTL"
import { ConfirmDialog } from "@/features/brands/components/ui/confirm-dialog"

type ApiError = ReadonlyArray<{ field: string; message: string }>

type Labels = {
    back: string
    save: string
    delete: string
    deleteTitle: string
    deleteDescription: string
    cancel: string
    confirm: string
}

export default function EditBrandUI(props: {
    title: string
    isSaving: boolean
    isBusy: boolean
    rtl: boolean
    onBack: () => void

    onRequestDelete: () => void
    onConfirmDelete: () => void
    deleteOpen: boolean
    setDeleteOpen: Dispatch<SetStateAction<boolean>>

    onSubmit: (values: CreateBrandRequest) => void
    formDefaults: Partial<CreateBrandRequest>
    initialLogoUrl?: string | null
    apiErrors: ApiError

    labels: Labels
}) {
    const {
        title,
        isSaving,
        isBusy,
        rtl,
        onBack,
        onRequestDelete,
        onConfirmDelete,
        deleteOpen,
        setDeleteOpen,
        onSubmit,
        formDefaults,
        initialLogoUrl,
        apiErrors,
        labels,
    } = props

    const isRTL = useIsRTL()

    return (
        <div className="flex-1 p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        className="shadow-none"
                        onClick={onBack}
                        aria-label={labels.back}
                        title={labels.back}
                        disabled={isBusy}
                    >
                        {(isRTL || rtl) ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    </Button>
                    <h1 className="text-2xl font-bold leading-none">{title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit" form="brand-form" disabled={isSaving}>
                        {labels.save}
                    </Button>
                    <Button variant="destructive" onClick={onRequestDelete} disabled={isBusy}>
                        {labels.delete}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <BrandForm
                formId="brand-form"
                defaultValues={formDefaults}
                initialLogoUrl={initialLogoUrl ?? undefined}
                onSubmit={onSubmit}
                submitting={isSaving}
                apiErrors={apiErrors}
            />

            {/* ConfirmDialog – RTL-safe */}
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={labels.deleteTitle}
                description={labels.deleteDescription}
                cancelLabel={labels.cancel}
                confirmLabel={labels.confirm}
                onConfirm={onConfirmDelete}
                disabled={isBusy}
                rtl={isRTL || rtl}
            />
        </div>
    )
}
