"use client";

import Image, { StaticImageData } from "next/image";
import styles from "@/styles/myshelf.module.scss";

import totalReadIcon from "@/public/myshelf/totalRead.svg";
import thisYearReadIcon from "@/public/myshelf/thisYearRead.svg";
import planReadIcon from "@/public/myshelf/planRead.svg";
import quotesIcon from "@/public/myshelf/quotes.svg";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { useGetUserLibrary } from "@/hooks/useGetUserLibrary";

interface UserLibraryType {
    id: string;
    addedAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    cover: string;
    finishedAt: string;
    quotes: string[];
    readPage: number;
    startedAt: string;
    status: string;
    title: string;
    totalPages: number;
}

export default function MyShelfClient() {
    const router = useRouter();
    const [books, setBooks] = useState<UserLibraryType[]>([]);
    const { userName, isLogin, userAccessToken } = useUserData();
    const { data, isLoading, error } = useGetUserLibrary(userAccessToken);

    useEffect(() => {
        if (!isLogin) router.push("/login");
    }, [isLogin, router]);

    useEffect(() => {
        if (data) setBooks(data);
    }, [data]);

    if (error) return <p>사용자 서재 데이터 불러오기 실패</p>;

    return (
        <>
            <p style={{ fontSize: "25px", fontWeight: "800" }}>{userName} 님의 서재</p>
            <div className={styles.userRecordArea}>
                <RecordBox imageSrc={totalReadIcon} imageAlt="total read icon" title="읽은 책" data="24권" />
                <RecordBox
                    imageSrc={thisYearReadIcon}
                    imageAlt="this year read icon"
                    title="올해 읽은 책"
                    data="14권"
                />
                <RecordBox imageSrc={planReadIcon} imageAlt="plan read icon" title="읽고 싶은 책" data="31권" />
            </div>

            <div className={styles.diaryArea}>
                {isLoading ? (
                    <p>불러오는 중</p>
                ) : (
                    books.map((val) => {
                        const date = new Date(val.addedAt._seconds * 1000);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const day = String(date.getDate()).padStart(2, "0");
                        const convertedDate = `${year}.${month}.${day}`;
                        return (
                            <Link className={styles.diary} href="myshelf/detail/1234" key={val.id}>
                                <div className={styles.diaryInfoBox}>
                                    <div className={styles.bookCoverArea}>
                                        <Image
                                            src={val.cover}
                                            alt={`${val.title} cover image`}
                                            fill
                                            sizes="120px"
                                            style={{ objectFit: "cover", objectPosition: "top" }}
                                        />
                                    </div>
                                    <div className={styles.diaryTextBox}>
                                        <p>
                                            {val.status === "읽은 책" &&
                                                `${val.startedAt.split("T")[0]} ~ ${val.finishedAt.split("T")[0]}`}
                                        </p>
                                        <p>{val.title}</p>
                                        <p>
                                            <span>{val.status}</span> |{" "}
                                            <span>
                                                {val.status === "읽는 중인 책" &&
                                                    `${val.readPage} / ${val.totalPages} 페이지`}
                                            </span>
                                        </p>
                                        <p>
                                            <span>일기에 추가한 날짜 : {convertedDate}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.diaryQuotesBox}>
                                    <p>
                                        <Image
                                            src={quotesIcon}
                                            alt="quotes icon"
                                            width={22}
                                            style={{ display: "inline-block" }}
                                        />
                                        <span>저장한 글귀</span>
                                    </p>
                                    <div className={styles.quote}>
                                        <p>&quot;여기에 글귀가 추가됩니다.(최대 표시 개수 지정하기(예상3개))&quot;</p>
                                        <p>- p.139</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </>
    );
}

interface recordBoxTypes {
    imageSrc: StaticImageData;
    imageAlt: string;
    title: string;
    data: string;
}

const RecordBox = ({ imageSrc, imageAlt, title, data }: recordBoxTypes) => {
    return (
        <div className={styles.recordBox}>
            <p>
                <Image src={imageSrc} alt={imageAlt} width={18} style={{ display: "inline-block" }} />
                &nbsp;{title}
            </p>
            <p>{data}</p>
        </div>
    );
};
