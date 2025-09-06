import type { AxiosError } from "axios"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

type ApiFieldError = { field: string; message: string }
type ApiErrorPayload = { message?: string; errors?: ApiFieldError[] }

export function extractErrorMessage(err: unknown): { title: string; desc?: string } {
    const { t } = useTranslation()
    const ax = err as AxiosError<ApiErrorPayload>
    const status = ax?.response?.status
    const backendMsg =
        ax?.response?.data?.message ||
        (typeof ax?.message === "string" ? ax.message : undefined)

    if (status === 422 && ax.response?.data?.errors?.length) {
        return {
            title: t("errors.validation"),
            desc: t("errors.fix_highlighted_fields"),
        }
    }

    switch (status) {
        case 400:
            return { title: t("errors.bad_request"), desc: backendMsg }
        case 401:
            return { title: t("errors.unauthorized"), desc: t("errors.please_login_again") }
        case 403:
            return { title: t("errors.forbidden"), desc: t("errors.access_denied") }
        case 404:
            return { title: t("errors.not_found"), desc: t("errors.item_not_found") }
        case 409:
            return { title: t("errors.conflict"), desc: backendMsg || t("errors.item_already_exists") }
        case 500:
            return { title: t("errors.server_error"), desc: t("errors.try_again_later") }
    }

    if (ax?.code === "ERR_NETWORK" || backendMsg?.toLowerCase().includes("network")) {
        return { title: t("errors.network_issue"), desc: t("errors.network_unavailable") }
    }

    return { title: t("errors.unknown"), desc: backendMsg || t("errors.try_again") }
}

export function showErrorToast(err: unknown) {
    const { title, desc } = extractErrorMessage(err)
    toast.error(title, {
        description: desc,
        duration: 3500,
    })
}
