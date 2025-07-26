"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/compareSelect.module.scss";
import Image from "next/image";

// types
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";

// hooks & utils
import { useToast } from "@/hooks/redux/useToast";
import { usePublicGetQuery } from "@/hooks/queries/usePublicGetQuery";
import { splitBookTitle } from "@/utils/book/splitBookTitle";

// components
import Loading from "@/app/loading";

// public
import searchBtn from "@/public/ui/searchBtn.svg";
import emptyBookIcon from "@/public/bookImage/compare.webp";

interface AladinSearchResultType {
    customerReviewRank: number;
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    priceStandard: string;
    priceSales: string;
    cover: string;
    isbn13: string;
    [key: string]: unknown;
}

export default function BookCompareSelectPage({ baseIsbn }: { baseIsbn: string | null }) {
    const router = useRouter();
    const { setToast } = useToast();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResult, setSearchResult] = useState<AladinSearchResultType[] | []>([]);
    const [selectedBookTitle, setSelectedBookTitle] = useState("-");
    const [selectedBookCover, setSelectedBookCover] = useState<string | null>(null);
    const [selectedBookIsbn, setSelectedBookIsbn] = useState<string | null>(null);

    // 사용자가 초기 선택한 도서 isbn으로 도서 정보 API 요청
    const {
        data: baseData,
        isLoading: isBaseLoading,
        error: baseError,
    } = usePublicGetQuery<AladinItemLookupType>(`/api/books/aladin/lookup?type=${baseIsbn}`);

    // 검색 버튼 입력시 searchKeyword로 검색 결과 API 요청
    const { isFetching: isSearchLoading, refetch: refetchSearch } = usePublicGetQuery<AladinSearchResultType[]>(
        `/api/books/aladin/search?query=${searchKeyword}`,
        {
            enabled: false,
        }
    );

    // 검색 버튼 입력시 refetch 및 searchResult 갱신
    const handleSearch = async () => {
        const { data } = await refetchSearch();
        if (data) setSearchResult(data);
        else setSearchResult([]);
    };

    // 비교 버튼 누르면 compare 페이지로 이동
    const handleCompare = () => {
        if (baseIsbn && selectedBookIsbn) {
            router.push(`/book/compare/${baseIsbn}_${selectedBookIsbn}`);
        } else {
            setToast({ message: "비교할 책을 선택해주세요.", type: "error" });
        }
    };

    // 페이지 최상단으로 스크롤
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isBaseLoading) return <Loading />;
    if (baseError) return <div>base error</div>;
    if (!baseData) return <div>데이터 없음</div>;
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <p style={{ fontSize: "25px", fontWeight: "800" }}>책 사이즈 비교하기</p>
            </div>
            <div className={styles.selectedArea}>
                <div className={styles.selectedBook}>
                    <div className={styles.selectedBookImage}>
                        <Image
                            src={baseData.cover}
                            alt="첫번째 선택 도서 표지"
                            fill
                            sizes="100px"
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <p className={styles.selectedBookText}>{baseData.title}</p>
                </div>
                <div className={styles.selectedBook}>
                    <div className={`${styles.selectedBookImage} ${!selectedBookCover && styles.emptySelectedBook}`}>
                        {selectedBookCover ? (
                            <Image
                                src={selectedBookCover}
                                alt="두번째 선택 도서 표지"
                                fill
                                sizes="100px"
                                style={{ objectFit: "contain" }}
                            />
                        ) : (
                            <Image src={emptyBookIcon} alt="두번째 도서가 선택되지 않음" width={30} />
                        )}
                    </div>
                    <p className={styles.selectedBookText}>{selectedBookTitle}</p>
                </div>
            </div>
            <button onClick={handleCompare} className={`${styles.compareBtn} ${selectedBookIsbn && styles.bgBluePink}`}>
                {selectedBookIsbn ? "선택 완료" : "비교할 도서 선택"}
            </button>
            <div className={styles.searchArea}>
                <input
                    className={styles.searchInput}
                    value={searchKeyword}
                    placeholder="비교할 책을 검색해주세요."
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                ></input>
                <button onClick={handleSearch} aria-label="검색">
                    <Image src={searchBtn} alt="" width={20} />
                </button>
            </div>
            <div className={styles.resultArea}>
                {isSearchLoading ? (
                    <Loading />
                ) : searchResult.length ? (
                    <div className={styles.resultGrid}>
                        {searchResult.map((val) => {
                            const [title] = splitBookTitle("val.title", "");
                            return (
                                <button
                                    onClick={() => {
                                        setSelectedBookTitle(val.title);
                                        setSelectedBookCover(val.cover);
                                        setSelectedBookIsbn(val.isbn13);
                                        scrollToTop();
                                    }}
                                    className={styles.resultItemButton}
                                    key={val.title}
                                >
                                    <div className={styles.resultImageArea}>
                                        <Image
                                            src={val.cover}
                                            alt={title}
                                            fill
                                            sizes="100px"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </div>
                                    <p className={styles.resultItemText}>{val.title}</p>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div>검색결과가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
