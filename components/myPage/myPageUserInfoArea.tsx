"use client";

import Image from "next/image";
import styles from "@/styles/mypage.module.scss";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";

// public
import defaultProfileImage from "@/public/ui/study.jpg";

export default function MyPageUserInfoArea() {
    const { userName, userEmail } = useUserData();

    return (
        <>
            <div className={styles.header}>
                <p>
                    반갑습니다, <span>{userName}</span>님.
                </p>
                <button>정보 수정</button>
            </div>
            <div className={styles.profileArea}>
                <div className={styles.profileImage}>
                    <Image src={defaultProfileImage} alt="profile image" fill priority placeholder="empty" />
                </div>
                <p>{userName}</p>
                <p>{userEmail}</p>
            </div>
            <div className={styles.readingStatusArea}>
                <div className={styles.readingInfo}>
                    <p>13</p>
                    <p>읽고 싶은 책</p>
                </div>
                <div className={styles.readingInfo}>
                    <p>25</p>
                    <p>읽고 있는 책</p>
                </div>
                <div className={styles.readingInfo}>
                    <p>49</p>
                    <p>다 읽은 책</p>
                </div>
            </div>
        </>
    );
}
