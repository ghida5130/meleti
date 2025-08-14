// hooks/useSecureUpload.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { signout } from "@/lib/firebase/auth";

type HttpError = { status: number; message: string };

type UploadInput = {
    file: File;
    fileKey?: string;
    fields?: Record<string, string | Blob>;
};

/**
 * 인증 토큰 포함 파일 업로드 훅 (multipart)
 * - 호출부는 파일과 부가 필드만 넘기면 됨
 * - 토큰 만료 시 자동 refresh → 실패 시 로그아웃
 */
export function useSecureFilePostMutation<TData>(
    url: string,
    options?: UseMutationOptions<TData, HttpError, UploadInput>
) {
    const { userAccessToken, setAccessToken, clearUserData } = useUserData();

    // 내부적으로 FormData 구성
    const buildBody = (input: UploadInput) => {
        const body = new FormData();
        const key = input.fileKey ?? "file";
        body.append(key, input.file);
        if (input.fields) {
            Object.entries(input.fields).forEach(([k, v]) => body.append(k, v));
        }
        return body;
    };

    // 실제 POST 요청 함수
    const requestOnce = async (token: string | null, input: UploadInput): Promise<TData> => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: buildBody(input),
            credentials: "include",
        });
        if (!res.ok) {
            throw { status: res.status, message: res.statusText } as HttpError;
        }
        return res.json();
    };

    // accessToken 재발급 후 재시도
    const refreshAndRetry = async (input: UploadInput) => {
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });
        if (!refreshRes.ok) {
            throw { status: refreshRes.status, message: refreshRes.statusText } as HttpError;
        }
        const { accessToken: newToken }: { accessToken: string } = await refreshRes.json();
        setAccessToken(newToken);
        return requestOnce(newToken, input);
    };

    const upload = async (input: UploadInput): Promise<TData> => {
        try {
            if (!userAccessToken) return await refreshAndRetry(input);
            return await requestOnce(userAccessToken, input);
        } catch (err) {
            if ((err as HttpError).status === 401) {
                try {
                    return await refreshAndRetry(input);
                } catch (refreshError) {
                    clearUserData();
                    signout();
                    throw refreshError as HttpError;
                }
            }
            throw err as HttpError;
        }
    };

    return useMutation<TData, HttpError, UploadInput>({
        mutationFn: upload,
        ...options,
    });
}
