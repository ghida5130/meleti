"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface AddToLibraryProps {
    email: string;
    isbn: string;
    status: string;
    title: string;
    totalPages: number;
    cover: string;
}

const addToLibrary = async (data: AddToLibraryProps) => {
    const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            router.refresh(); // 예시로 새로고침 (next/navigation)
        },
        onError: (error) => {
            console.error("Error adding book:", error);
            // 여기서 에러 토스트 띄우거나 처리 가능
        },
    });
}
