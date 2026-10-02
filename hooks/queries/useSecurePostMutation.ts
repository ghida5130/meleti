import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useUserData } from "../redux/useUserData";
import { authFetch, HttpError } from "@/lib/api/authFetch";

export function useSecurePostMutation<TData, TVariables>(
    url: string,
    options?: UseMutationOptions<TData, HttpError, TVariables>
) {
    const { clearUserData } = useUserData();

    return useMutation<TData, HttpError, TVariables>({
        mutationFn: async (variables) => {
            try {
                return await authFetch<TData>(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(variables),
                });
            } catch (error) {
                if ((error as HttpError).status === 401) clearUserData();
                throw error;
            }
        },
        ...options,
    });
}
