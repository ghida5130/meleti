import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { authFetch, HttpError } from "@/lib/api/authFetch";

export function useSecureGetQuery<TData>(
    url: string,
    options?: Omit<UseQueryOptions<TData, HttpError>, "queryKey" | "queryFn">
) {
    const { uid, clearUserData } = useUserData();

    return useQuery<TData, HttpError>({
        queryKey: [uid, url],
        queryFn: async () => {
            try {
                return await authFetch<TData>(url, { cache: "no-store" });
            } catch (error) {
                if ((error as HttpError).status === 401) clearUserData();
                throw error;
            }
        },
        retry: (count, error) => error.status !== 401 && count < 2,
        ...options,
    });
}
