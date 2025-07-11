"use client";

import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { signout } from "@/lib/firebase/auth";
import Loading from "@/app/loading";
import "@/styles/datePicker.module.scss";

export default function AccessTokenInitializer({ children }: { children: React.ReactNode }) {
    const { userAccessToken, clearUserData, setUserData } = useUserData();
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        if (userAccessToken) {
            setIsInit(true);
            return;
        }

        const refresh = async () => {
            try {
                const res = await fetch("/api/auth/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("accessToken 재발급 실패");

                const data = await res.json();

                setUserData({
                    accessToken: data.accessToken,
                    name: data.name,
                    email: data.email,
                    expiresIn: Date.now() + 15 * 60 * 1000,
                });
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error("알수없는 accessToken 재발급 에러", error);
                }
                clearUserData();
                if (userAccessToken) signout();
            } finally {
                setIsInit(true);
            }
        };

        refresh();
    }, []);

    if (!isInit) return <Loading />;
    return <>{children}</>;
}
