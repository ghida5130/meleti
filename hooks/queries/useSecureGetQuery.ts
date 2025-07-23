import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { signout } from "@/lib/firebase/auth";

type HttpError = {
    status: number;
    message: string;
};

export function useSecureGetQuery<TData>(
    url: string,
    options?: Omit<UseQueryOptions<TData, HttpError>, "queryKey" | "queryFn">
) {
    const { userAccessToken, setAccessToken, clearUserData } = useUserData();

    const fetchWithAuth = async (token: string | null): Promise<TData> => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw {
                status: response.status,
                message: response.statusText,
            } satisfies HttpError;
        }

        return response.json();
    };

    // POST 요청중 accessToken이 없거나 서버로부터 401응답을 받을경우 accessToken 재발급
    const tryRefreshAndRetry = async (): Promise<TData> => {
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!refreshRes.ok) {
            throw {
                status: refreshRes.status,
                message: refreshRes.statusText,
            } satisfies HttpError;
        }

        const { accessToken: newToken }: { accessToken: string } = await refreshRes.json();
        setAccessToken(newToken);
        return await fetchWithAuth(newToken);
    };

    const queryFn = async (): Promise<TData> => {
        try {
            if (!userAccessToken) {
                return await tryRefreshAndRetry();
            }
            return await fetchWithAuth(userAccessToken);
        } catch (err) {
            if ((err as HttpError).status === 401) {
                try {
                    return await tryRefreshAndRetry();
                } catch (refreshErr) {
                    clearUserData();
                    signout();
                    throw refreshErr as HttpError;
                }
            }

            throw err as HttpError;
        }
    };

    return useQuery<TData, HttpError>({
        queryKey: [url],
        queryFn,
        ...options,
    });
}
