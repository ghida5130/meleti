import SectionTitle from "../sectionTitle";
import Carousel from "./carousel";
import styles from "/styles/page.module.scss";
import axios from "axios";

export default async function content() {
    const bestSellerResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BestSeller`);
    const newReleaseResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=ItemNewSpecial`);
    const blogBestResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BlogBest`);
    const bestSellerData = bestSellerResponse.data;
    const newReleaseData = newReleaseResponse.data;
    const blogBestData = blogBestResponse.data;

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
