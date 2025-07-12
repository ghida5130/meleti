"use client";

import styles from "@/styles/login.module.scss";
import { signInWithGoogle, signInWithGithub, signInDemo } from "@/lib/firebase/auth";
import { useUserData } from "@/hooks/useUserData";

export default function LoginClient() {
    const { setUserData } = useUserData();

    const handleLogin = async (type: "google" | "github" | "demo") => {
        try {
            const signInFn = type === "google" ? signInWithGoogle : type === "github" ? signInWithGithub : signInDemo;

            const data = await signInFn();
            setUserData({
                accessToken: data.accessToken,
                name: data.name,
                email: data.email,
                expiresIn: Date.now() + 15 * 60 * 1000,
            });
            window.location.href = "/";
        } catch (err) {
            console.error("로그인 실패:", err);
        }
    };

    return (
        <>
            <p>로그인하고 나만의 독서 일기를 작성해보세요</p>
            <button onClick={() => handleLogin("google")} className={styles.btn}>
                Google 로그인
            </button>
            <button onClick={() => handleLogin("github")} className={styles.btn}>
                Github 로그인
            </button>
            <button onClick={() => handleLogin("demo")} className={styles.btn}>
                테스트 계정 로그인
            </button>
        </>
    );
}
