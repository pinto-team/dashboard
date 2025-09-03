// shared/lib/errors.ts
import type { AxiosError } from "axios";
import { toast } from "sonner";

type ApiFieldError = { field: string; message: string };
type ApiErrorPayload = { message?: string; errors?: ApiFieldError[] };

export function extractErrorMessage(err: unknown): { title: string; desc?: string } {
    const ax = err as AxiosError<ApiErrorPayload>;
    const status = ax?.response?.status;

    // 422: خطای فیلدی (به فرم‌ها سپرده می‌شود)
    if (status === 422 && ax.response?.data?.errors?.length) {
        return { title: "خطا در ورودی‌ها", desc: "لطفاً فیلدهای هایلایت‌شده را اصلاح کنید." };
    }

    const backendMsg =
        ax?.response?.data?.message ||
        (typeof ax?.message === "string" ? ax.message : undefined);

    switch (status) {
        case 400: return { title: "درخواست نامعتبر", desc: backendMsg };
        case 401: return { title: "نیاز به ورود", desc: "لطفاً دوباره وارد شوید." };
        case 403: return { title: "دسترسی غیرمجاز", desc: "مجوز دسترسی به این بخش را ندارید." };
        case 404: return { title: "یافت نشد", desc: "مورد درخواستی پیدا نشد." };
        case 409: return { title: "تداخل داده", desc: backendMsg || "این مورد قبلاً وجود دارد." };
        case 500: return { title: "مشکل سرور", desc: "بعداً دوباره تلاش کنید." };
    }

    if (ax?.code === "ERR_NETWORK" || backendMsg?.toLowerCase().includes("network")) {
        return { title: "مشکل اتصال", desc: "اتصال اینترنت یا سرور در دسترس نیست." };
    }

    return { title: "خطای نامشخص", desc: backendMsg || "مشکلی پیش آمد، دوباره تلاش کنید." };
}

export function showErrorToast(err: unknown) {
    const { title, desc } = extractErrorMessage(err);
    toast.error(title, {
        description: desc,
        duration: 3500,
    });
}
