import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { signout } from "@/lib/firebase/auth";

type HttpError = {
    status: number;
    message: string;
};

/**
 * 인증 토큰을 포함한 POST 요청을 처리하는 React Query용 커스텀 훅
 * - accessToken이 없거나 만료된 경우 자동으로 재발급 시도
 * - 재발급 실패 시 유저 상태 초기화 및 signout 실행
 *
 * @param url 요청할 API 경로
 * @param options useMutation에 넘길 옵션들
 */
export function useSecurePostMutation<TData, TVariables>(
    url: string,
    options?: UseMutationOptions<TData, HttpError, TVariables>
) {
    const { userAccessToken, setAccessToken, clearUserData } = useUserData();

    // 실제 POST 요청 함수
    const postWithAuth = async (variables: TVariables): Promise<TData> => {
        // accessToken을 포함한 fetch
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

        // accessToken이 없거나 401 에러 발생 시 refreshToken으로 accessToken 재발급 후 재요청
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
            // accessToken이 없을때 바로 refresh 시도
            if (!userAccessToken) {
                return await tryRefreshAndRetry();
            }
            return await postRequest(userAccessToken);
        } catch (error) {
            // 401 에러 발생시 refresh 시도
            // refresh 시도 실패시 사용자 로그아웃 처리
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
