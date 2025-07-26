import styles from "@/styles/page.module.scss";

// hooks & utils
import { fetchAladinItems } from "@/lib/api/fetchAladinItems";

// components
import SectionTitle from "../ui/sectionTitle";
import Carousel from "./carousel";

export const revalidate = 3600;

export default async function Content() {
    const bestSellerData = await fetchAladinItems("BestSeller");
    const newReleaseData = await fetchAladinItems("ItemNewSpecial");
    const blogBestData = await fetchAladinItems("BlogBest");

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
