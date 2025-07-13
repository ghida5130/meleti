"use client";

//alt 속성 수정

import { useSecureGetQuery } from "@/hooks/useSecureGetQuery";
import { useSearchParams } from "next/navigation";
import styles from "/styles/compareSelect.module.scss";
import Image from "next/image";
import searchBtn from "@/public/ui/searchBtn.svg";
import testImage2 from "@/public/test/frontTestImage2.jpg";
import { useState } from "react";

interface AladinItemLookupType {
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    isbn13: string;
    description: string;
    cover: string;
    categoryName: string;
    subInfo: {
        subTitle: string;
        originalTitle: string;
        itemPage: number;
    };
    [key: string]: unknown;
}

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

export default function Select() {
    const searchParams = useSearchParams();
    const baseIsbn = searchParams.get("base");
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
    } = useSecureGetQuery<AladinItemLookupType[]>(`/api/books/aladin/lookup?type=${baseIsbn}`);

    // 검색 버튼 입력시 searchKeyword로 검색 결과 API 요청
    const { isFetching: isSearchLoading, refetch: refetchSearch } = useSecureGetQuery<AladinSearchResultType[]>(
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

    if (isBaseLoading) return <div>Base Loading...</div>;
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
                        <Image src={baseData[0].cover} alt="" fill sizes="100px" style={{ objectFit: "contain" }} />
                    </div>
                    <p className={styles.selectedBookText}>{baseData[0].title}</p>
                </div>
                <div className={styles.selectedBook}>
                    <div className={styles.selectedBookImage}>
                        <Image
                            src={selectedBookCover === null ? testImage2 : selectedBookCover}
                            alt=""
                            fill
                            sizes="100px"
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <p className={styles.selectedBookText}>{selectedBookTitle}</p>
                </div>
            </div>
            <button className={`${styles.compareBtn} ${selectedBookIsbn && styles.bgBluePink}`}>
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
                <button onClick={handleSearch}>
                    <Image src={searchBtn} alt="search button" width={20} />
                </button>
            </div>
            {isSearchLoading ? (
                <div>검색중</div>
            ) : searchResult.length ? (
                <div className={styles.resultGrid}>
                    {searchResult.map((val) => {
                        return (
                            <button
                                onClick={() => {
                                    setSelectedBookTitle(val.title);
                                    setSelectedBookCover(val.cover);
                                    setSelectedBookIsbn(val.isbn13);
                                }}
                                className={styles.resultItemButton}
                                key={val.title}
                            >
                                <div className={styles.resultImageArea}>
                                    <Image src={val.cover} alt="" fill sizes="100px" style={{ objectFit: "contain" }} />
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
    );
}
