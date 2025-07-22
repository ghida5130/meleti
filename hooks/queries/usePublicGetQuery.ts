import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type HttpError = {
    status: number;
    message: string;
};

export function usePublicGetQuery<TData>(
    url: string,
    options?: Omit<UseQueryOptions<TData, HttpError>, "queryKey" | "queryFn">
) {
    const fetchPublic = async (): Promise<TData> => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw {
                status: response.status,
                message: response.statusText,
            } satisfies HttpError;
        }

        return response.json();
    };

    return useQuery<TData, HttpError>({
        queryKey: [url],
        queryFn: fetchPublic,
        ...options,
    });
}
