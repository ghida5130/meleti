import Image from "next/image";
import styles from "/styles/page.module.scss";

//images
import testImage from "../public/study.jpg";

// components
import Content from "@/components/mainPage/content";

export const dynamic = "force-dynamic";

export default async function Home() {
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
            <Content />
        </div>
    );
}
