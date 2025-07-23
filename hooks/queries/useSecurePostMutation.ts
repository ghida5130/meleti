import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { signout } from "@/lib/firebase/auth";

type HttpError = {
    status: number;
    message: string;
};

export function useSecurePostMutation<TData, TVariables>(
    url: string,
    options?: UseMutationOptions<TData, HttpError, TVariables>
) {
    const { userAccessToken, setAccessToken, clearUserData } = useUserData();

    const postWithAuth = async (variables: TVariables): Promise<TData> => {
        const postRequest = async (token: string | null): Promise<TData> => {
            const response = await fetch(`${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(variables),
                credentials: "include",
            });

            if (!response.ok) {
                const error: HttpError = {
                    status: response.status,
                    message: response.statusText,
                };
                throw error;
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
            return await postRequest(newToken);
        };

        try {
            if (!userAccessToken) {
                return await tryRefreshAndRetry();
            }
            return await postRequest(userAccessToken);
        } catch (error) {
            if ((error as HttpError).status === 401) {
                try {
                    return await tryRefreshAndRetry();
                } catch (refreshError) {
                    clearUserData();
                    signout();
                    throw refreshError as HttpError;
                }
            }

            throw error as HttpError;
        }
    };

    return useMutation<TData, HttpError, TVariables>({
        mutationFn: postWithAuth,
        ...options,
    });
}
