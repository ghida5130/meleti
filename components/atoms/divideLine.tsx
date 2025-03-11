import styles from "/styles/divideLine.module.scss";

export default function DivideLine() {
    return (
        <div className={styles.wrap}>
            <div className={styles.divideLine} />
            <div className={styles.divideLine2} />
        </div>
    );
}
