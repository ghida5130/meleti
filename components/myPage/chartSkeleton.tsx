import styles from "@/styles/skeleton.module.scss";

// components
import LoadingImage from "../ui/loadingImage";

export default function ChartSkeleton() {
    return (
        <div className={styles.chartWrap}>
            <LoadingImage />
            <p>독서 통계 계산중...</p>
        </div>
    );
}
