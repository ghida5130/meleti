"use client";

import Image, { StaticImageData } from "next/image";
import styles from "/styles/myshelf.module.scss";

import totalReadIcon from "@/public/myshelf/totalRead.svg";
import thisYearReadIcon from "@/public/myshelf/thisYearRead.svg";
import planReadIcon from "@/public/myshelf/planRead.svg";
import quotesIcon from "@/public/myshelf/quotes.svg";
import testBookImage from "@/public/test/frontTestImage.jpg";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebasedb";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";

interface UserLibraryType {
    id: string;
    addedAt: {
        seconds: number;
        nanoseconds: number;
    };
    cover: string;
    finishedAt: number;
    quotes: string[];
    readPage: number;
    startedAt: number;
    status: string;
    title: string;
    totalPages: number;
}

export default function MyShelf() {
    const router = useRouter();
    const [books, setBooks] = useState<UserLibraryType[]>([]);
    const [loading, setLoading] = useState(true);
    const { userName, userEmail, isLogin } = useUserData();

    useEffect(() => {
        const fetchUserLibrary = async () => {
            try {
                const libraryRef = collection(db, "users", String(userEmail), "library");
                const querySnapShot = await getDocs(libraryRef);
                const libraryBooks = querySnapShot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as UserLibraryType[];

                setBooks(libraryBooks);
            } catch (error) {
                console.error("사용자 도서 데이터 불러오기 실패", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLogin) {
            fetchUserLibrary();
        } else router.push("/login");
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.wrap}>
            <p style={{ fontSize: "25px", fontWeight: "800" }}>{userName} 님의 독서일기</p>
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
                {books.map((val) => {
                    return (
                        <Link className={styles.diary} href="myshelf/detail/1234" key={val.id}>
                            <p>2024.03.02 ~ 2024.03.09</p>
                            <div className={styles.diaryInfoBox}>
                                {/* 데이터 받아올때 alt 수정 */}
                                <Image src={testBookImage} alt={`${val.title} cover image`} height={100} />
                                <div className={styles.diaryTextBox}>
                                    <p>{val.title}</p>
                                    <p>
                                        <span>{val.status}</span> | <span>123 / {val.totalPages}p</span>
                                    </p>
                                    <p>
                                        <span>일기에 추가한 날짜 : {val.addedAt.seconds}</span>
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
                })}
            </div>
        </div>
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
