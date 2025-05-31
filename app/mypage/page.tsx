"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "/styles/mypage.module.scss";

//image
import defaultProfileImage from "@/public/study.jpg";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebasedb";
import { signout } from "@/lib/firebase/auth";

export default function MyPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    if (!user) return <div>user data null</div>;
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <p>
                    반갑습니다, <span>{user.displayName}</span>님.
                </p>
                <button>정보 수정</button>
            </div>
            <div className={styles.profileArea}>
                <div className={styles.profileImage}>
                    <Image
                        src={user.photoURL ?? defaultProfileImage}
                        alt="profile image"
                        fill
                        priority
                        placeholder="empty"
                    />
                </div>
                <p>{user.displayName}</p>
                <p>{user.email}</p>
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
            <div className={styles.divide} />
            <div className={styles.menuArea}>
                <div className={styles.menuTitle}>보관함</div>
                <ul>
                    <li>
                        <Link href="/">즐겨찾기</Link>
                    </li>
                    <li>
                        <Link href="/">좋아요 표시한 구절</Link>
                    </li>
                </ul>
                <div className={styles.menuTitle}>독서 기록 관리</div>
                <ul>
                    <li>
                        <Link href="/myshelf">나의 독서일기</Link>
                    </li>
                    <li>
                        <Link href="/">독서 기록 통계</Link>
                    </li>
                    <li>
                        <Link href="/">기록 초기화</Link>
                    </li>
                </ul>
                <div className={styles.menuTitle}>계정 정보</div>
                <ul>
                    <li>
                        <Link href="/">개인정보 관리</Link>
                    </li>
                    <li>
                        <button onClick={signout}>로그아웃</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
