import styles from "/styles/community.module.scss";

export default function Community() {
    return (
        <div className={styles.wrap}>
            <p style={{ fontSize: "25px", fontWeight: "800" }}>커뮤니티</p>
            <p>글귀, 책페이지, 책표지, 책제목, 작성날짜, 작성자, 좋아요수</p>
        </div>
    );
}
