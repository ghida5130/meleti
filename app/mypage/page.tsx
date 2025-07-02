import MyPageClient from "@/components/myPage/myPageClient";
import styles from "@/styles/mypage.module.scss";

export default function MyPagePage() {
    return (
        <div className={styles.wrap}>
            <MyPageClient />
        </div>
    );
}
