"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "@/styles/myshelf.module.scss";

// public
import totalReadIcon from "@/public/myshelf/totalRead.svg";
import thisYearReadIcon from "@/public/myshelf/thisYearRead.svg";
import planReadIcon from "@/public/myshelf/planRead.svg";
import { UsersBookInfo } from "@/app/api/users/library/route";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";
import { useSecureGetQuery } from "@/hooks/queries/useSecureGetQuery";

// components
import Loading from "@/app/loading";
import BookCard from "./bookCard";

export default function MyShelfClient() {
    const [books, setBooks] = useState<UsersBookInfo[]>([]);
    const { userName } = useUserData();
    const { data, isLoading, error } = useSecureGetQuery<UsersBookInfo[]>("api/users/library");

    useEffect(() => {
        if (data) setBooks(data);
    }, [data]);

    if (error) return <p>사용자 서재 데이터 불러오기 실패</p>;

    return (
        <>
            <p style={{ fontSize: "25px", fontWeight: "800" }}>{userName} 님의 서재</p>
            <div className={styles.userRecordArea}>
                <RecordBox imageSrc={totalReadIcon} imageAlt="total read icon" title="읽은 책" data="20권" />
                <RecordBox
                    imageSrc={thisYearReadIcon}
                    imageAlt="this year read icon"
                    title="올해 읽은 책"
                    data="20권"
                />
                <RecordBox imageSrc={planReadIcon} imageAlt="plan read icon" title="읽고 싶은 책" data="1권" />
            </div>
            <div className={styles.diaryArea}>
                {isLoading ? (
                    <Loading />
                ) : (
                    books.map((val) => {
                        return <BookCard key={val.id} val={val} />;
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
