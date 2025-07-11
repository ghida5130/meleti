"use client";

import { useQuery } from "@tanstack/react-query";

const getUserLibrary = async (accessToken: string | null) => {
    const res = await fetch("/api/users/library", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        throw new Error("사용자 서재 불러오기 실패");
    }

    return res.json();
};

export function useGetUserLibrary(accessToken: string | null) {
    return useQuery({
        queryKey: ["userLibrary", accessToken],
        queryFn: () => getUserLibrary(accessToken!),
        enabled: !!accessToken,
    });
}
