import styles from "@/styles/skeleton.module.scss";

// components
import LoadingWithMessage from "@/components/ui/loadingWithMessage";

export default function BookImageSkeleton() {
    return (
        <div className={styles.bookImageWrap}>
            <LoadingWithMessage message="책 사이즈 계산중..." />
        </div>
    );
}
