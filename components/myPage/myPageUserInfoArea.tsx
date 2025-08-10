"use client";

import Image from "next/image";
import styles from "@/styles/mypage.module.scss";

// type
import { CountByStatusType } from "@/app/api/users/library/count/route";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";
import { useSecureGetQuery } from "@/hooks/queries/useSecureGetQuery";

// public
import defaultProfileImage from "@/public/ui/study.jpg";
import Link from "next/link";

export default function MyPageUserInfoArea() {
    const { userName, userEmail } = useUserData();
    const { data, isLoading, error } = useSecureGetQuery<CountByStatusType>("api/users/library/count");

    return (
        <>
            <div className={styles.header}>
                <p>
                    반갑습니다, <span>{userName}</span>님.
                </p>
                <Link href="/user/profile/image/edit">프로필 이미지 수정</Link>
            </div>
            <div className={styles.profileArea}>
                <div className={styles.profileImage}>
                    <Image src={defaultProfileImage} alt="profile image" fill priority placeholder="empty" />
                </div>
                <p>{userName}</p>
                <p>{userEmail}</p>
            </div>
            <div className={styles.readingStatusArea}>
                {isLoading ? (
                    <p>서재 개수 불러오는중...</p>
                ) : (
                    <>
                        <div className={styles.readingInfo}>
                            <p>{error ? "-" : data?.wish ?? 0}</p>
                            <p>읽고 싶은 책</p>
                        </div>
                        <div className={styles.readingInfo}>
                            <p>{error ? "-" : data?.reading ?? 0}</p>
                            <p>읽고 있는 책</p>
                        </div>
                        <div className={styles.readingInfo}>
                            <p>{error ? "-" : data?.finished ?? 0}</p>
                            <p>다 읽은 책</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
