import Link from "next/link";
import styles from "/styles/bottombar.module.scss";
import Image from "next/image";
import { StaticImageData } from "next/image";

import homeImage from "@/public/bottomBar/home.svg";
import searchImage from "@/public/bottomBar/search.svg";
import myShelfImage from "@/public/bottomBar/myshelf.svg";
import communityImage from "@/public/bottomBar/community.svg";
import myPageImage from "@/public/bottomBar/mypage.svg";
import Toast from "../ui/toast";

export default function BottomBar() {
    return (
        <div>
            <Toast />
            <div className={styles.bottomBarWrap}>
                <BottomBarBtn src={homeImage} href="/" alt="homePageButton" />
                <BottomBarBtn src={searchImage} href="/" alt="searchPageButton" />
                <BottomBarBtn src={myShelfImage} href="/myshelf" alt="myShelfPageButton" />
                <BottomBarBtn src={communityImage} href="/community" alt="communityPageButton" />
                <BottomBarBtn src={myPageImage} href="/mypage" alt="myPageButton" />
            </div>
        </div>
    );
}

const BottomBarBtn = ({ src, href, alt }: { src: StaticImageData; href: string; alt: string }) => {
    return (
        <Link className={styles.bottomBarBtn} href={href}>
            <Image src={src} width={25} alt={alt} />
        </Link>
    );
};
