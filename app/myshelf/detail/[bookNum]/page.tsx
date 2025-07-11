import Image from "next/image";
import styles from "/styles/myshelfDetail.module.scss";

import DivideLine from "@/components/ui/divideLine";
import SectionTitle from "@/components/ui/sectionTitle";

import testBookImage from "@/public/test/frontTestImage.jpg";
import authorIcon from "/public/bookPage/author.svg";
import publisherIcon from "/public/bookPage/publisher.svg";
import underArrowIcon from "@/public/myshelf/underArrow.svg";
import editIcon from "@/public/myshelf/edit.svg";
import newQuoteIcon from "@/public/myshelf/newQuote.svg";
import prevPageIcon from "@/public/myshelf/backArrow.svg";
import Link from "next/link";

export default async function Detail({ params }: { params: Promise<{ bookNum: string }> }) {
    const isbn = (await params).bookNum;
    console.log(isbn);
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <Link href="/myshelf" scroll={true}>
                    <Image src={prevPageIcon} alt="previous page button" width={35} />
                </Link>
                <h1 style={{ fontSize: "25px", fontWeight: "600" }}>멸망 이전의 샹그릴라</h1>
            </div>
            <h2 style={{ fontSize: "20px" }}>샹그릴라 - 부제목</h2>
            <div className={styles.bookInfoArea}>
                <Image src={testBookImage} alt="book cover image" height={250} />
                <p>
                    <Image src={authorIcon} alt="authorIcon" width={14} style={{ display: "inline-block" }} />
                    &nbsp;나기라 유 (지은이), 김선영 (옮긴이)
                </p>
                <p>
                    <Image src={publisherIcon} alt="publisherIcon" width={14} style={{ display: "inline-block" }} />
                    &nbsp;한즈미디어(한스미디어)
                </p>
            </div>
            <DivideLine />
            <div className={styles.readProgressArea}>
                <SectionTitle title="나의 독서량" />
                <div className={styles.progressBarArea}>
                    <div className={styles.progressBarBackground} />
                    <div className={styles.progressBar} style={{ clipPath: `inset(0 calc(${100 - 68}%) 0 0)` }} />
                    <div className={styles.progressBarPointer} />
                </div>
                <p style={{ fontSize: "20px", fontWeight: "600" }}>68%</p>
                <button className={styles.progressPageButton}>
                    <p>
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>219</span> / 341 페이지
                    </p>
                    <Image
                        src={underArrowIcon}
                        alt="reading status button icon"
                        width={20}
                        style={{ display: "inline-block" }}
                    />
                </button>
            </div>
            <DivideLine />
            <div className={styles.readHistoryArea}>
                <SectionTitle title="나의 독서 이력" />
                <button>
                    읽고 있는 책
                    <Image
                        src={underArrowIcon}
                        alt="reading status button"
                        width={20}
                        style={{ display: "inline-block" }}
                    />
                </button>
                <p>일기에 추가한 날짜 : 2024-03-02</p>
                <button>
                    읽기 시작한 날짜 : 2024-03-03
                    <Image
                        src={underArrowIcon}
                        alt="reading start date button"
                        width={20}
                        style={{ display: "inline-block" }}
                    />
                </button>
                <button>
                    다 읽은 날짜 : -
                    <Image
                        src={underArrowIcon}
                        alt="reading finish date button"
                        width={20}
                        style={{ display: "inline-block" }}
                    />
                </button>
            </div>
            <DivideLine />

            <div className={styles.quotesArea}>
                <SectionTitle title="글귀" />
                <p>
                    &quot;이곳에 저장된 글귀가 표시됩니다.&quot;
                    <button>
                        <Image src={editIcon} alt="quotes edit button" />
                    </button>
                </p>
                <p>
                    &quot;이곳에 저장된 글귀가 표시됩니다.&quot;
                    <button>
                        <Image src={editIcon} alt="quotes edit button" />
                    </button>
                </p>
                <p>
                    &quot;글귀 최대 개수 지정하기&quot;
                    <button>
                        <Image src={editIcon} alt="quotes edit button" />
                    </button>
                </p>
                <button className={styles.addQuoteButton}>
                    <Image src={newQuoteIcon} alt="quotes edit button" width={25} />
                </button>
            </div>
        </div>
    );
}
