// shared/api/crudFactory.ts
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import apiClient, { createFeatureClient } from "@/lib/axios"; // ← این همون اینستنس با رفرش‌ـه
import type { ApiResponse } from "./types";

export type Id = string | number;

export type ListParams = {
    page?: number;
    limit?: number;
    offset?: number;
    q?: string;
    [k: string]: unknown;
};

export type CrudFactoryOptions = {
    /** اگر سرویس روی هاست/پورت دیگری است اینجا بده؛ باز هم اینستنس با رفرش ساخته می‌شود */
    baseURL?: string;
    /** فقط برای هدر X-Feature */
    feature?: string;
    /** در موارد خیلی خاص اگر خواستی اینستنس بدهی — پیشنهاد نمی‌شود */
    client?: AxiosInstance;
};

/** نرمال‌سازی مسیرها: جلو/عقب اسلش اضافه نیفتد */
function joinPath(basePath: string, suffix?: string | number) {
    const base = basePath.replace(/\/+$/, "");
    if (suffix === undefined || suffix === null || suffix === "") return base;
    return `${base}/${String(suffix).replace(/^\/+/, "")}`;
}

/**
 * CRUD استانداردی که همیشه از اینستنس مجهز به رفرش استفاده می‌کند.
 * - اگر baseURL دادی: createFeatureClient می‌سازد (با refresh/queue).
 * - اگر client دادی: از همان استفاده می‌کند (⚠️ مسئولیت با خودت).
 * - در غیر این صورت: apiClient پیش‌فرض استفاده می‌شود.
 */
export function createCrudApi<TData, TCreate, TUpdate = Partial<TCreate>>(
    basePath: string,
    opts: CrudFactoryOptions = {}
) {
    const client: AxiosInstance =
        opts.client ??
        (opts.baseURL
            ? createFeatureClient({
                baseURL: opts.baseURL,
                feature: opts.feature,
                enableAuth: true,
                enableRefresh: true,
            })
            : apiClient);

    return {
        list: (params?: ListParams, cfg?: AxiosRequestConfig) =>
            client
                .get<ApiResponse<TData[]>>(joinPath(basePath), { params, ...cfg })
                .then((r) => r.data),

        detail: (id: Id, cfg?: AxiosRequestConfig) =>
            client
                .get<ApiResponse<TData>>(joinPath(basePath, id), cfg)
                .then((r) => r.data),

        create: (payload: TCreate, cfg?: AxiosRequestConfig) =>
            client
                .post<ApiResponse<TData>>(joinPath(basePath), payload, cfg)
                .then((r) => r.data),

        update: (id: Id, payload: TUpdate, cfg?: AxiosRequestConfig) =>
            client
                .put<ApiResponse<TData>>(joinPath(basePath, id), payload, cfg)
                .then((r) => r.data),

        remove: (id: Id, cfg?: AxiosRequestConfig) =>
            client
                .delete<ApiResponse<void>>(joinPath(basePath, id), cfg)
                .then((r) => r.data),
    };
}

export default createCrudApi;
