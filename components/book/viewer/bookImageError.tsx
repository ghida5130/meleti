import styles from "@/styles/error.module.scss";

export default function BookImageError() {
    return (
        <div className={styles.bookImageWrap}>
            <p>책 사이즈를 사용할 수 없습니다.</p>
        </div>
    );
}
