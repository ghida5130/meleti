"use client";

import Link from "next/link";
import styles from "./search.module.scss";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// public
import searchBtn from "@/public/ui/searchBtn.svg";
import backArrow from "@/public/ui/back_arrow.svg";

const recentSearchStorageKey = "meleti:recent-searches";
const recommendedBooks = [
    { title: "멸망 이전의 샹그릴라", author: "나기라 유", cover: "/test/frontTestImage.jpg" },
    { title: "채식주의자", author: "한강", cover: "/test/frontTestImage2.jpg" },
];

export default function SearchClient() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        inputRef.current?.focus();
        try {
            const saved: unknown = JSON.parse(localStorage.getItem(recentSearchStorageKey) ?? "[]");
            if (Array.isArray(saved)) {
                const keywords = saved
                    .filter((keyword): keyword is string => typeof keyword === "string")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean);
                setRecentSearches(Array.from(new Set(keywords)).slice(0, 10));
            }
        } catch {
            // - 저장된 검색 기록을 읽을 수 없으면 빈 목록 유지
        }
    }, []);

    const saveRecentSearch = (keyword: string) => {
        const updated = [keyword, ...recentSearches.filter((item) => item !== keyword)].slice(0, 10);
        setRecentSearches(updated);
        try {
            localStorage.setItem(recentSearchStorageKey, JSON.stringify(updated));
        } catch {
            // - 저장소 사용이 제한되어도 검색 진행
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const value = inputRef.current?.value.trim();
        if (!value) {
            e.preventDefault();
            alert("검색어를 입력해주세요.");
            return;
        }
        if (inputRef.current) inputRef.current.value = value;
        saveRecentSearch(value);
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
                    <button type="submit" aria-label="검색">
                        <Image src={searchBtn} alt="" width={20} />
                    </button>
                </form>
            </div>

            <div className={styles.recentSearchArea}>
                <h2 className={styles.sectionTitle}>최근 검색어</h2>
                {recentSearches.length > 0 ? (
                    <ul className={styles.recentSearchList}>
                        {recentSearches.map((keyword) => (
                            <li key={keyword}>
                                <Link
                                    href={`/search/result?query=${encodeURIComponent(keyword)}`}
                                    onClick={() => saveRecentSearch(keyword)}
                                >
                                    {keyword}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptySearch}>최근 검색어가 없습니다.</p>
                )}
            </div>

            <div className={styles.recommendBooksArea}>
                <h2 className={styles.sectionTitle}>추천하는 책</h2>
                <ul className={styles.recommendedBooks}>
                    {recommendedBooks.map((book) => (
                        <li key={book.title}>
                            <Link
                                href={`/search/result?query=${encodeURIComponent(book.title)}`}
                                onClick={() => saveRecentSearch(book.title)}
                            >
                                <div className={styles.recommendedCover}>
                                    <Image src={book.cover} alt={`${book.title} 표지`} fill sizes="(max-width: 600px) 45vw, 240px" />
                                </div>
                                <p className={styles.bookTitle}>{book.title}</p>
                                <p className={styles.bookAuthor}>{book.author}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
