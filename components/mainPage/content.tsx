import SectionTitle from "../ui/sectionTitle";
import Carousel from "./carousel";
import styles from "/styles/page.module.scss";

export const revalidate = 3600;

export default async function Content() {
    const baseUrl = process.env.SERVER_BASE_URL
        ? process.env.SERVER_BASE_URL.replace(/\/$/, "") // 마지막 슬래시 제거
        : `https://${process.env.VERCEL_URL}`;

    const urls = [
        `${baseUrl}/api/books/aladin?type=BestSeller`,
        `${baseUrl}/api/books/aladin?type=ItemNewSpecial`,
        `${baseUrl}/api/books/aladin?type=BlogBest`,
    ];

    const [bestSellerData, newReleaseData, blogBestData] = await Promise.all(
        urls.map((u) => fetch(u, { next: { revalidate } }).then((r) => r.json()))
    );

    return (
        <div className={styles.content}>
            <SectionTitle title="베스트 셀러" />
            <Carousel data={bestSellerData} />
            <SectionTitle title="주목할만한 신간" />
            <Carousel data={newReleaseData} />
            <SectionTitle title="블로그 베스트셀러" />
            <Carousel data={blogBestData} />
        </div>
    );
}
