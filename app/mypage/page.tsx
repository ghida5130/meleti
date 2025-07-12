import LogoutButton from "@/components/myPage/logoutButton";
import MyPageUserInfoArea from "@/components/myPage/myPageUserInfoArea";
import UserMonthlyStatsChart from "@/components/myPage/userMonthlyStatsChart";
import styles from "@/styles/mypage.module.scss";
import Link from "next/link";

export default function MyPagePage() {
    return (
        <div className={styles.wrap}>
            <MyPageUserInfoArea />
            <div className={styles.divide} />
            <div className={styles.chartArea}>
                <div className={styles.menuTitle}>2024년 독서 통계</div>
                <UserMonthlyStatsChart />
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
                    <LogoutButton />
                </ul>
            </div>
        </div>
    );
}
