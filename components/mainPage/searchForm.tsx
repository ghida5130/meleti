"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/styles/searchForm.module.scss";

export default function SearchForm() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const searchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={searchSubmit} className={styles.searchForm}>
            <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색"
                required
                className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
                검색
            </button>
        </form>
    );
}
