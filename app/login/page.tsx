"use client";

import styles from "@/styles/login.module.scss";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase/auth";
import { useUserData } from "@/hooks/useUserData";

export default function Login() {
    const { setUserData } = useUserData();

    const handleGoogleLogin = async () => {
        try {
            const data = await signInWithGoogle();
            setUserData({
                accessToken: data.accessToken,
                name: data.name,
                email: data.email,
            });
        } catch (error) {
            console.error("로그인 실패:", error);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const data = await signInWithGithub();
            setUserData({
                accessToken: data.accessToken,
                name: data.name,
                email: data.email,
            });
        } catch (error) {
            console.error("로그인 실패:", error);
        }
    };

    return (
        <div className={styles.wrap}>
            <p>로그인하고 나만의 독서 일기를 작성해보세요</p>
            <button onClick={handleGoogleLogin} className={styles.btn}>
                Google 로그인
            </button>
            <button onClick={handleGithubLogin} className={styles.btn}>
                Github 로그인
            </button>
        </div>
    );
}
