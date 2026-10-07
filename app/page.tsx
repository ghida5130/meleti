import Image from "next/image";
import styles from "@/components/mainPage/home.module.scss";

// public
import testImage from "@/public/ui/study.jpg";

// components
import Content from "@/components/mainPage/content";

export const revalidate = 3600;

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
