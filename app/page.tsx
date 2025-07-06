import Image from "next/image";
import styles from "/styles/page.module.scss";

//images
import testImage from "../public/study.jpg";

// components
import Content from "@/components/mainPage/content";

export default async function Home() {
    return (
        <div>
            <div className={styles.bannerArea}>
                <Image
                    src={testImage}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="600px"
                    priority
                    fetchPriority="high"
                />
            </div>
            <Content />
        </div>
    );
}
