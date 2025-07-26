import Image from "next/image";
import styles from "@/styles/createQuotePost.module.scss";

// components
import DivideLine from "@/components/ui/divideLine";

// public
import bookTestImage from "@/public/test/frontTestImage2.jpg";
import bookSearchButtonIcon from "@/public/ui/searchBtn.svg";
import newPostIcon from "@/public/community/newPost.svg";
import bookFrontTest from "@/public/test/frontTestImage2.jpg";
import backButtonIcon from "@/public/ui/back_arrow.svg";

export default function CommunityQuotePostPage() {
    return (
        <div className={styles.wrap}>
            <p style={{ fontSize: "25px", fontWeight: "800", width: "90%", margin: "0 auto" }}>글귀 작성하기</p>
            <div className={styles.bookSelectArea}>
                <button className={styles.bookSelectBox}>
                    <Image src={bookTestImage} alt="selected book image" height={100} />
                    <p style={{ fontSize: "15px", fontWeight: "600" }}>책을 선택해주세요. (책제목)</p>
                    <Image src={bookSearchButtonIcon} alt="book search button" width={20} />
                </button>
            </div>
            <DivideLine />
            <div className={styles.pageSelectArea}>
                <p style={{ fontSize: "15px", marginBottom: "10px", fontWeight: "600" }}>페이지 (선택)</p>
                <input placeholder="p.135" style={{ paddingLeft: "5px" }}></input>
            </div>
            <div className={styles.quoteArea}>
                <p style={{ fontSize: "15px", marginBottom: "10px", fontWeight: "600" }}>글귀</p>
                <textarea
                    placeholder="예) 꽃은 필 때도 아름답지만, 질 때도 아름답다."
                    style={{ paddingLeft: "5px" }}
                ></textarea>
            </div>
            <div className={styles.privateSettingArea}>
                <p style={{ fontSize: "15px", marginBottom: "10px", fontWeight: "600" }}>공개 여부</p>
                <input type="checkbox" name="isPublic" style={{ transform: "scale(1.5)" }}></input>
                <span>내 서재에만 기록됩니다.</span>
            </div>
            <div className={styles.submitArea}>
                <button className={styles.submitButton}>
                    <Image src={newPostIcon} alt="new post button" width={15} /> 작성 완료
                </button>
            </div>
            <div className={`${styles.popupWrap} `}>
                <div className={styles.searchResultWrap}>
                    <div className={styles.searchBar}>
                        <button>
                            <Image src={backButtonIcon} alt="back button" width={25} />
                        </button>
                        <input placeholder="검색어를 입력해주세요."></input>
                        <button>
                            <Image src={bookSearchButtonIcon} alt="book search button" width={25} />
                        </button>
                    </div>
                    <div className={styles.searchResultHeader}>
                        <p style={{ fontSize: "20px" }}>
                            <span style={{ fontSize: "25px" }}>&quot;채식주의자&quot;</span> 검색 결과
                        </p>
                    </div>
                    <div className={styles.searchResult}>
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
                                    <span style={{ fontWeight: "600", color: "rgb(60, 133, 228)" }}>
                                        17,900원 (10% 할인)
                                    </span>
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
