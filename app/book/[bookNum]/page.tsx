import BookImage from "./bookImage";
import styles from "/styles/book.module.scss";

// image
import authorIcon from "../../../public/bookPage/author.svg";
import publisherIcon from "../../../public/bookPage/publisher.svg";
import Image from "next/image";

// const test = {
//     title: "작별하지 않는다 - 2024 노벨문학상 수상작가, 한강 장편소설",
//     link: "http://www.aladin.co.kr/shop/wproduct.aspx?ItemId=278770576&amp;partner=openAPI&amp;start=api",
//     author: "한강 (지은이)",
//     pubDate: "2021-09-09",
//     description:
//         "2016년 &lt;채식주의자&gt;로 인터내셔널 부커상을 수상하고 2018년 &lt;흰&gt;으로 같은 상 최종 후보에 오른 한강 작가의 5년 만의 장편소설. 2019년 겨울부터 이듬해 봄까지 계간 &lt;문학동네&gt;에 전반부를 연재하며  큰 관심을 모은 작품이다.",
//     isbn: "8954682154",
//     isbn13: "9788954682152",
//     itemId: 278770576,
//     priceSales: 15120,
//     priceStandard: 16800,
//     mallType: "BOOK",
//     stockStatus: "",
//     mileage: 840,
//     cover: "https://image.aladin.co.kr/product/27877/5/coversum/8954682154_3.jpg",
//     categoryId: 50993,
//     categoryName: "국내도서>소설/시/희곡>한국소설>2000년대 이후 한국소설",
//     publisher: "문학동네",
//     salesPoint: 1186545,
//     adult: false,
//     fixedPrice: true,
//     customerReviewRank: 9,
//     subInfo: {
//         subTitle: "2024 노벨문학상 수상작가, 한강 장편소설",
//         originalTitle: "",
//         itemPage: 332,
//     },
// };

export default async function Book({ params }: { params: Promise<{ bookNum: string }> }) {
    const isbn13 = (await params).bookNum;
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemLookUp?type=${isbn13}`);
    let test = await res.json();
    test = test[0];
    let decoded;

    // const bookDetailResponse = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemLookUp?type=${isbn13}`);
    // const test = bookDetailResponse.data[0];

    if (test) {
        decoded = test.description.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }

    return (
        <div className={styles.wrap}>
            <BookImage cover={test.cover} />
            <div className={styles.basicInfoArea}>
                <p style={{ fontSize: "25px", fontWeight: "600" }}>{test.title}</p>
                <p style={{ fontSize: "20px" }}>{test.subInfo.subTitle}</p>
                <p className={styles.author}>
                    <Image src={authorIcon} alt="authorIcon" width={13} />
                    &nbsp;{test.author}
                </p>
                <p>
                    <Image src={publisherIcon} alt="publisherIcon" width={13} />
                    <span className={styles.publisher}>&nbsp;{test.publisher}</span> | {test.pubDate}
                </p>
            </div>
            <DevideLine />
            <div className={styles.infoArea}>
                <p>{test.categoryName}</p>
                <p>{decoded}</p>
            </div>
        </div>
    );
}

const DevideLine = () => {
    return (
        <>
            <div className={styles.divideLine} />
            <div className={styles.divideLine2} />
        </>
    );
};
