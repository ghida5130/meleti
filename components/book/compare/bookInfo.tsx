import styles from "./bookInfo.module.scss";

// types
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";

// hooks & utils
import { splitBookTitle } from "@/utils/book/splitBookTitle";

type BookInfoProps = {
    book1: AladinItemLookupType;
    book2: AladinItemLookupType;
};

export default function BookInfo({ book1, book2 }: BookInfoProps) {
    const [title1] = splitBookTitle(book1.title, book1.subInfo.subTitle);
    const [title2] = splitBookTitle(book2.title, book2.subInfo.subTitle);

    return (
        <section className={styles.booksInfoArea} aria-label="도서 정보 비교">
            <article className={styles.bookCol}>
                <h2 className={styles.titleText}>{title1}</h2>
                <dl>
                    <div className={styles.value}>
                        <dt>가로</dt>
                        <dd>{book1.subInfo.packing.sizeWidth}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>세로</dt>
                        <dd>{book1.subInfo.packing.sizeHeight}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>두께</dt>
                        <dd>{book1.subInfo.packing.sizeDepth}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>무게</dt>
                        <dd>{book1.subInfo.packing.weight}g</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>페이지수</dt>
                        <dd>{book1.subInfo.itemPage}p</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>출판일</dt>
                        <dd>{book1.pubDate}</dd>
                    </div>
                </dl>
            </article>

            <div className={styles.labelCol} aria-hidden="true">
                <p></p>
                <p>가로</p>
                <p>세로</p>
                <p>두께</p>
                <p>무게</p>
                <p>페이지수</p>
                <p>출판일</p>
            </div>

            <article className={styles.bookCol}>
                <h2 className={styles.titleText}>{title2}</h2>
                <dl>
                    <div className={styles.value}>
                        <dt>가로</dt>
                        <dd>{book2.subInfo.packing.sizeWidth}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>세로</dt>
                        <dd>{book2.subInfo.packing.sizeHeight}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>두께</dt>
                        <dd>{book2.subInfo.packing.sizeDepth}cm</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>무게</dt>
                        <dd>{book2.subInfo.packing.weight}g</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>페이지수</dt>
                        <dd>{book2.subInfo.itemPage}p</dd>
                    </div>
                    <div className={styles.value}>
                        <dt>출판일</dt>
                        <dd>{book2.pubDate}</dd>
                    </div>
                </dl>
            </article>
        </section>
    );
}
