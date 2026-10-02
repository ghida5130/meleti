"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { clearUser, setUser } from "@/store/user/userSlice";
import { prepareClientAuth } from "@/lib/firebase/auth";

export default function SessionInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const controller = new AbortController();
        prepareClientAuth().catch((error: unknown) => console.error("Firebase 인증 상태 초기화 실패:", error));

        const loadSession = async () => {
            try {
                const response = await fetch("/api/auth/session", {
                    credentials: "include",
                    cache: "no-store",
                    signal: controller.signal,
                });
                if (!response.ok) {
                    dispatch(clearUser());
                    if (response.status === 401 && (
                        window.location.pathname.startsWith("/myshelf") ||
                        window.location.pathname.startsWith("/user") ||
                        window.location.pathname.startsWith("/community/post")
                    )) window.location.replace("/login");
                    return;
                }
                dispatch(setUser(await response.json()));
            } catch {
                if (!controller.signal.aborted) dispatch(clearUser());
            }
        };

        loadSession();
        return () => controller.abort();
    }, [dispatch]);

    return null;
}
