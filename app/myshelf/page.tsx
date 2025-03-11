"use client";

import Image, { StaticImageData } from "next/image";
import styles from "/styles/myshelf.module.scss";

import totalReadIcon from "@/public/myshelf/totalRead.svg";
import thisYearReadIcon from "@/public/myshelf/thisYearRead.svg";
import planReadIcon from "@/public/myshelf/planRead.svg";
import quotesIcon from "@/public/myshelf/quotes.svg";
import testBookImage from "@/public/test/frontTestImage.jpg";
import Link from "next/link";

export default function MyShelf() {
    return (
        <div className={styles.wrap}>
            <p style={{ fontSize: "25px", fontWeight: "800" }}>Meleti 님의 독서일기</p>
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
                <Link className={styles.diary} href="myshelf/detail/1234">
                    <p>2024.03.02 ~ 2024.03.09</p>
                    <div className={styles.diaryInfoBox}>
                        <Image src={testBookImage} alt="" height={100} />
                        <div className={styles.diaryTextBox}>
                            <p>멸망 이전의 샹그릴라</p>
                            <p>
                                <span>다 읽은 책</span> | <span>241 / 369p</span>
                            </p>
                            <p>
                                <span>일기에 추가한 날짜 : 24.02.14</span>
                            </p>
                        </div>
                    </div>
                    <div className={styles.diaryQuotesBox}>
                        <p>
                            <Image src={quotesIcon} alt="quotes icon" width={22} style={{ display: "inline-block" }} />
                            <span>저장한 글귀</span>
                        </p>
                        <div className={styles.quote}>
                            <p>&quot;여기에 글귀가 추가됩니다.(최대 표시 개수 지정하기(예상3개))&quot;</p>
                            <p>- p.139</p>
                        </div>
                    </div>
                </Link>
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
