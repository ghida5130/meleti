export type HttpError = { status: number; message: string };

export async function authFetch<TData>(url: string, init?: RequestInit): Promise<TData> {
    const response = await fetch(url, { ...init, credentials: "include" });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            window.location.assign("/login");
        }
        throw {
            status: response.status,
            message: data && typeof data.error === "string" ? data.error : response.statusText,
        } satisfies HttpError;
    }
    return data as TData;
}
