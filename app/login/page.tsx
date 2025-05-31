"use client";

import styles from "@/styles/login.module.scss";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase/auth";

export default function Login() {
    return (
        <div className={styles.wrap}>
            <p>로그인하고 나만의 독서 일기를 작성해보세요</p>
            <button onClick={signInWithGoogle} className={styles.btn}>
                Google 로그인
            </button>
            <button onClick={signInWithGithub} className={styles.btn}>
                Github 로그인
            </button>
        </div>
    );
}
