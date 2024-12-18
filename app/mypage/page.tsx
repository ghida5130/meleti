import styles from "./page.module.scss";

export default function Home() {
    return (
        <div style={{ fontSize: "40px" }}>
            <p className={styles.test}>firebase로 auth구현</p>
            <p>Chart.js로 독서 통계 차트 구현</p>
        </div>
    );
}
