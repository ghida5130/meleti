"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface AddToLibraryProps {
    accessToken: string;
    isbn: string;
    status: string;
    title: string;
    totalPages: number;
    cover: string;
}

const addToLibrary = async ({ accessToken, ...data }: AddToLibraryProps) => {
    const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to add to library");
    }

    return res.json();
};

export function useAddToLibrary() {
    const router = useRouter();

    return useMutation({
        mutationFn: addToLibrary,
        onSuccess: () => {
            // 책 추가 성공하면 팝업 닫거나, 페이지 새로고침, 알림 띄우기 등
            router.refresh(); // 새로고침 (next/navigation)
        },
        onError: (error) => {
            console.error("Error adding book:", error);
        },
    });
}
