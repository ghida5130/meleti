import styles from "/styles/book.module.scss";
import Image from "next/image";
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";
import { splitBookTitle } from "@/utils/book/splitBookTitle";

// image
import authorIcon from "/public/bookPage/author.svg";
import publisherIcon from "/public/bookPage/publisher.svg";
import pagesIcon from "/public/bookPage/pages.svg";

// components
import DivideLine from "@/components/ui/divideLine";
import SectionTitle from "@/components/ui/sectionTitle";

export default async function TestBook({ params }: { params: { bookNum: string } }) {
    const isbn13 = params.bookNum;
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn13}`, {
        next: { revalidate: 0 },
    });
    const book = (await res.json()) as AladinItemLookupType;

    const [title, subtitle] = splitBookTitle(book.title, book.subInfo.subTitle ?? "");

    return (
        <>
            <div className={styles.wrap}>
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
            </div>
        </>
    );
}
