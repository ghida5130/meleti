"use client";

import Link from "next/link";
import styles from "@/styles/search.module.scss";
import Image from "next/image";
import searchBtn from "@/public/searchBtn.svg";
import backArrow from "@/public/back_arrow.svg";
import { useEffect, useRef } from "react";

export default function SearchClient() {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const value = inputRef.current?.value.trim();
        if (!value) {
            e.preventDefault();
            alert("검색어를 입력해주세요.");
        }
    };

    return (
        <>
            <div className={styles.searchArea}>
                <Link href="/">
                    <Image src={backArrow} alt="back button" width={20} />
                </Link>
                <form
                    className={styles.searchFormArea}
                    action="/search/result"
                    method="get"
                    data-testid="search-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="search-input" className="sr-only">
                        검색어
                    </label>
                    <input
                        id="search-input"
                        ref={inputRef}
                        className={styles.searchInputArea}
                        name="query"
                        type="text"
                        placeholder="검색어를 입력하세요"
                    />
                    <button>
                        <Image src={searchBtn} alt="search button" width={20} />
                    </button>
                </form>
            </div>

            <div className={styles.recentSearchArea}>
                <p style={{ fontWeight: "600" }}>최근 검색어</p>
                <p>최근 검색어가 없습니다.</p>
            </div>

            <div className={styles.recommendBooksArea}>
                <p style={{ fontWeight: "600" }}>추천하는 책</p>
                <p>Algolia로 검색 기능 구현하기</p>
                <p>알라딘에도 상품 검색 api가 있음</p>
            </div>
        </>
    );
}
