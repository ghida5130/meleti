import SectionTitle from "../atoms/sectionTitle";
import Carousel from "./carousel";
import styles from "/styles/page.module.scss";

export const revalidate = 3600;

export default async function Content() {
    const bestSellerResponse = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BestSeller`);
    const newReleaseResponse = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=ItemNewSpecial`);
    const blogBestResponse = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BlogBest`);

    const bestSellerData = await bestSellerResponse.json();
    const newReleaseData = await newReleaseResponse.json();
    const blogBestData = await blogBestResponse.json();

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
