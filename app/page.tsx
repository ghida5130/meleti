import Image from "next/image";
import styles from "/styles/page.module.scss";
import axios from "axios";

//images
import testImage from "../public/study.jpg";

// components
import SectionTitle from "./components/sectionTitle";
import Carousel from "./components/mainPage/carousel";

export default async function Home() {
    const bestSellerResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BestSeller`);
    const newReleaseResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=ItemNewSpecial`);
    const blogBestResponse = await axios.get(`${process.env.SERVER_BASE_URL}/api/aladinItemList?type=BlogBest`);
    const bestSellerData = bestSellerResponse.data;
    const newReleaseData = newReleaseResponse.data;
    const blogBestData = blogBestResponse.data;

    return (
        <div>
            <div className={styles.bannerArea}>
                <Image src={testImage} alt="" fill style={{ objectFit: "cover" }} />
            </div>
            {/* <div className={styles.mainPageSearchArea}>
                <Link href="/search" className={styles.mainPageSearchBtn}>
                    <Image src={searchBtn} alt="searchButton" width={20} style={{ marginRight: "10px" }} />
                    검색
                </Link>
            </div> */}
            <div className={styles.content}>
                <SectionTitle title="베스트 셀러" />
                <Carousel data={bestSellerData} />
                <SectionTitle title="주목할만한 신간" />
                <Carousel data={newReleaseData} />
                <SectionTitle title="블로그 베스트셀러" />
                <Carousel data={blogBestData} />
            </div>
        </div>
    );
}
