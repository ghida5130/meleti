"use client";

import LoginClient from "@/components/login/loginClient";
import styles from "@/styles/login.module.scss";

export default function Login() {
    return (
        <div className={styles.wrap}>
            <LoginClient />
        </div>
    );
}
