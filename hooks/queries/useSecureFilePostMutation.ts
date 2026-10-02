import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { authFetch, HttpError } from "@/lib/api/authFetch";

type UploadInput = {
    file: File;
    fileKey?: string;
    fields?: Record<string, string | Blob>;
};

export function useSecureFilePostMutation<TData>(
    url: string,
    options?: UseMutationOptions<TData, HttpError, UploadInput>
) {
    const { clearUserData } = useUserData();

    return useMutation<TData, HttpError, UploadInput>({
        mutationFn: async ({ file, fileKey = "file", fields }) => {
            const body = new FormData();
            body.append(fileKey, file);
            if (fields) Object.entries(fields).forEach(([key, value]) => body.append(key, value));

            try {
                return await authFetch<TData>(url, { method: "POST", body });
            } catch (error) {
                if ((error as HttpError).status === 401) clearUserData();
                throw error;
            }
        },
        ...options,
    });
}
