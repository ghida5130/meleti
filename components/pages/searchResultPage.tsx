import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/searchResultPage.module.scss";

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

export default async function SearchResultPage({ query }: { query: string | undefined }) {
    const searchResultResponse = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/search?query=${query}`);
    const searchResultData: AladinSearchResultType[] = await searchResultResponse.json();

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <p style={{ fontSize: "20px" }}>
                    <span style={{ fontSize: "25px" }}>&quot;{query}&quot;</span> 검색 결과
                </p>
            </div>
            <div className={styles.main}>
                {searchResultData.length !== 0 ? (
                    searchResultData.map((val) => {
                        return (
                            <Link
                                href={`/book/${val.isbn13}`}
                                className={styles.item}
                                key={`${val.title} ${val.pubDate}`}
                            >
                                <div className={styles.bookCoverImage}>
                                    <Image
                                        src={val.cover}
                                        alt={`${val.title} book cover`}
                                        fill
                                        sizes="120px"
                                        style={{ objectFit: "cover", objectPosition: "top" }}
                                    />
                                </div>
                                <div className={styles.bookInfo}>
                                    <p style={{ fontSize: "18px" }}>⭐ {val.customerReviewRank || "-"}</p>
                                    <p style={{ fontSize: "18px", fontWeight: "700" }}>{val.title}</p>
                                    <p style={{ fontSize: "14px" }}>
                                        <span>{val.author}</span> | <span>{val.publisher}</span> |{" "}
                                        <span>{val.pubDate}</span>
                                    </p>
                                    <p>
                                        <span style={{ fontSize: "14px" }}>
                                            정가 {val.priceStandard.toLocaleString()}원 →{" "}
                                        </span>
                                        <span style={{ fontWeight: "600", color: "rgb(60, 133, 228)" }}>
                                            {val.priceSales.toLocaleString()}원 (10% 할인)
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
