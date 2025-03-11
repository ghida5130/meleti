import styles from "/styles/searchResultPage.module.scss";
import bookFrontTest from "/public/test/frontTestImage2.jpg";
import Image from "next/image";

export default function Search() {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <p style={{ fontSize: "20px" }}>
                    <span style={{ fontSize: "25px" }}>&quot;채식주의자&quot;</span> 검색 결과
                </p>
            </div>
            <div className={styles.main}>
                <button className={styles.item}>
                    <div className={styles.bookCoverImage}>
                        <Image src={bookFrontTest} alt="bookCover" height={160} />
                    </div>
                    <div className={styles.bookInfo}>
                        <p style={{ fontSize: "18px" }}>⭐ 9.0</p>
                        <p style={{ fontSize: "18px", fontWeight: "700" }}>
                            채식주의자 (리마스터판) - 2024 노벨문학상 수상작가
                        </p>
                        <p style={{ fontSize: "14px" }}>
                            <span>한강 (지은이)</span> | <span>창비</span> | <span>2022-03-28</span>
                        </p>
                        <p>
                            <span style={{ fontSize: "14px" }}>정가 23,500원 → </span>
                            <span style={{ fontWeight: "600", color: "rgb(60, 133, 228)" }}>17,900원 (10% 할인)</span>
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}

// 책사진, 제목, 작가, 출판사, 출간일, 알라딘평점
