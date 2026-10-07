import styles from "./carouselSkeleton.module.scss";

export default function CarouselSkeleton() {
    return (
        <div className={styles.list} role="status" aria-label="도서 목록 불러오는 중">
            {[0, 1, 2].map((index) => (
                <div className={styles.item} key={index} aria-hidden="true">
                    <div className={styles.cover} />
                    <div className={styles.text} />
                    <div className={styles.textShort} />
                </div>
            ))}
        </div>
    );
}
