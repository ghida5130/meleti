"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/myshelfDetail.module.scss";
import { UsersBookInfo } from "@/app/api/users/library/route";
import { useSecureGetQuery } from "@/hooks/queries/useSecureGetQuery";
import DivideLine from "@/components/ui/divideLine";
import SectionTitle from "@/components/ui/sectionTitle";
import prevPageIcon from "@/public/myshelf/backArrow.svg";

export default function MyShelfDetailPage({ isbn }: { isbn: string }) {
    const { data: book, isLoading, error } = useSecureGetQuery<UsersBookInfo>(`/api/users/library/${isbn}`);

    if (isLoading) return <p>독서 기록을 불러오는 중입니다.</p>;
    if (error || !book) return <p>{error?.message ?? "독서 기록을 찾을 수 없습니다."}</p>;

    const readPage = book.status === "읽은 책" ? book.totalPages : book.readPage;
    const progress = book.totalPages > 0 ? Math.min(100, Math.round(readPage / book.totalPages * 100)) : 0;
    const addedDate = book.addedAt?._seconds
        ? new Date(book.addedAt._seconds * 1000).toLocaleDateString("ko-KR")
        : "-";

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <Link href="/myshelf" scroll={true}>
                    <Image src={prevPageIcon} alt="서재로 돌아가기" width={35} />
                </Link>
                <h1 style={{ fontSize: "25px", fontWeight: "600" }}>{book.title}</h1>
            </div>
            <div className={styles.bookInfoArea}>
                <Image src={book.cover} alt={`${book.title} 표지`} width={170} height={250} style={{ objectFit: "contain" }} />
                <p>{book.status}</p>
            </div>
            <DivideLine />
            <div className={styles.readProgressArea}>
                <SectionTitle title="나의 독서량" />
                <div className={styles.progressBarArea}>
                    <div className={styles.progressBarBackground} />
                    <div className={styles.progressBar} style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }} />
                </div>
                <p>{readPage} / {book.totalPages} 페이지 ({progress}%)</p>
            </div>
            <DivideLine />
            <div className={styles.readHistoryArea}>
                <SectionTitle title="나의 독서 이력" />
                <p>서재에 추가한 날짜: {addedDate}</p>
                {book.startedAt && <p>읽기 시작한 날짜: {new Date(book.startedAt).toLocaleDateString("ko-KR")}</p>}
                {book.finishedAt && <p>다 읽은 날짜: {new Date(book.finishedAt).toLocaleDateString("ko-KR")}</p>}
            </div>
            <DivideLine />
            <div className={styles.quotesArea}>
                <SectionTitle title="글귀" />
                {book.quotes.length ? book.quotes.map((quote, index) => <p key={`${index}-${quote}`}>{quote}</p>) : <p>저장한 글귀가 없습니다.</p>}
            </div>
        </div>
    );
}
