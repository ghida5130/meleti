import { UsersBookInfo } from "@/app/api/users/library/route";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/myshelf.module.scss";
import quotesIcon from "@/public/myshelf/quotes.svg";

export default function BookCard({ val }: { val: UsersBookInfo }) {
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
                        {val.status === "읽은 책" && `${val.startedAt.split("T")[0]} ~ ${val.finishedAt.split("T")[0]}`}
                    </p>
                    <p>{val.title}</p>
                    <p>
                        <span>{val.status}</span> |{" "}
                        <span>{val.status === "읽는 중인 책" && `${val.readPage} / ${val.totalPages} 페이지`}</span>
                    </p>
                    <p>
                        <span>일기에 추가한 날짜 : {convertedDate}</span>
                    </p>
                </div>
            </div>
            {val.quotes.length > 0 && (
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
            )}
        </Link>
    );
}
