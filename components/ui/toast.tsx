"use client";

import styles from "@/styles/toast.module.scss";

// hooks & utils
import { useToast } from "@/hooks/redux/useToast";

export default function Toast() {
    const { toastVisible, toastMessage, toastType } = useToast();

    const getIcon = (type: typeof toastType) => {
        switch (type) {
            case "success":
                return "✅";
            case "error":
                return "⚠️";
            case "info":
            default:
                return "ℹ️";
        }
    };

    return (
        <div className={`${styles.wrap} ${!toastVisible && styles.hide}`}>
            <div className={styles.toast}>
                <p>
                    {getIcon(toastType)} {toastMessage}
                </p>
            </div>
        </div>
    );
}
