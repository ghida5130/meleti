import styles from "@/styles/book.module.scss";
import Image from "next/image";
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";
import { splitBookTitle } from "@/utils/book/splitBookTitle";
import { BookProvider } from "../../../providers/BookContext";

// image
import authorIcon from "@/public/bookPage/author.svg";
import publisherIcon from "@/public/bookPage/publisher.svg";
import pagesIcon from "@/public/bookPage/pages.svg";

// components
import DivideLine from "@/components/ui/divideLine";
import Carousel from "@/components/mainPage/carousel";
import SectionTitle from "@/components/ui/sectionTitle";
import AddToLibraryPopup from "@/components/book/popup/AddToLibraryPopup";
import Book3DViewer from "@/components/book/viewer/book3DViewer";

export default async function BookDetailPage({ bookNum }: { bookNum: string }) {
    const isbn13 = bookNum;
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn13}`, {
        next: { revalidate: 0 },
    });
    const book = (await res.json()) as AladinItemLookupType;

    const [title, subtitle] = splitBookTitle(book.title, book.subInfo.subTitle ?? "");

    // json-LD
    const jsonLD = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": title,
        "author": {
            "@type": "Person",
            "name": book.author,
        },
        "publisher": {
            "@type": "Organization",
            "name": book.publisher,
        },
        "datePublished": book.pubDate,
        "isbn": book.isbn13,
        "description": book.description,
        "image": book.cover,
        "category": book.categoryName,
        "numberOfPages": book.subInfo.itemPage,
        "url": `https://meleti-sigma.vercel.app/book/${bookNum}`,
    };

    return (
        <>
            <div className={styles.wrap}>
                <BookProvider>
                    <Book3DViewer cover={book.cover} isbn={isbn13} />
                    <AddToLibraryPopup
                        isbn={bookNum}
                        title={title}
                        totalPages={book.subInfo.itemPage}
                        cover={book.cover}
                    />
                </BookProvider>
                <section className={styles.basicInfoArea}>
                    <h1 style={{ fontSize: "25px", fontWeight: "600" }}>{title}</h1>
                    {subtitle && <h2 style={{ fontSize: "20px" }}>{subtitle}</h2>}
                    <p>
                        <Image
                            src={authorIcon}
                            alt="authorIcon"
                            width={14}
                            style={{ display: "inline-block" }}
                            priority
                        />
                        &nbsp;{book.author}
                    </p>
                    <p>
                        <Image
                            src={publisherIcon}
                            alt="publisherIcon"
                            width={14}
                            style={{ display: "inline-block" }}
                            priority
                        />
                        <span className={styles.publisher}>&nbsp;{book.publisher}</span> | {book.pubDate}
                    </p>
                    <p>
                        <Image src={pagesIcon} alt="pageIcon" width={14} style={{ display: "inline-block" }} priority />
                        &nbsp;{book.subInfo.itemPage} 페이지
                    </p>
                </section>
                <DivideLine />
                <section className={styles.infoArea}>
                    <SectionTitle title="• 카테고리" />
                    <p>{book.categoryName}</p>
                    <SectionTitle title="• 책 소개" />
                    <p style={{ lineHeight: "1.5" }}>{book.description}</p>
                </section>
                <DivideLine />
                <section className={styles.quotesArea}>
                    <SectionTitle title="이 책의 글귀" />
                    <p>&quot;이곳에 저장된 글귀가 표시됩니다.&quot;</p>
                    <p>&quot;이곳에 저장된 글귀가 표시됩니다.&quot;</p>
                    <p>&quot;이곳에 저장된 글귀가 표시됩니다.&quot;</p>
                    <p>&quot;이곳에 저장된 글귀가 표시됩니다.&quot;</p>
                </section>
                <DivideLine />
                <section className={styles.bookRecommendArea}>
                    <SectionTitle title="관련 도서" />
                    <Carousel />
                    <p>추천도서, 관련도서, 같은 작가의 책 등</p>
                    <Carousel />
                </section>
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }} />
        </>
    );
}
