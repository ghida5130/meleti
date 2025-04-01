import Image from "next/image";
import styles from "/styles/mypage.module.scss";

import testProfileImage from "@/public/study.jpg";
import Link from "next/link";

export default function MyPage() {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <p>
                    반갑습니다, <span>Meleti</span>님.
                </p>
                <button>정보 수정</button>
            </div>
            <div className={styles.profileArea}>
                <div className={styles.profileImage}>
                    <Image src={testProfileImage} alt="profile image" fill priority placeholder="empty" />
                </div>
                <p>Meleti</p>
                <p>meleti@gmail.com</p>
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
                        <Link href="/">나의 독서일기</Link>
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
                        <Link href="/">회원 탈퇴</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
