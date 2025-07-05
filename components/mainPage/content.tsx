import SectionTitle from "../atoms/sectionTitle";
import Carousel from "./carousel";
import styles from "/styles/page.module.scss";

// ISR 설정 (1시간마다 재생성)
export const revalidate = 3600;

export default async function Content() {
    const [bestSellerRes, newReleaseRes, blogBestRes] = await Promise.all([
        fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BestSeller`),
        fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=ItemNewSpecial`),
        fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BlogBest`),
    ]);

    const [bestSellerData, newReleaseData, blogBestData] = await Promise.all([
        bestSellerRes.json(),
        newReleaseRes.json(),
        blogBestRes.json(),
    ]);

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
