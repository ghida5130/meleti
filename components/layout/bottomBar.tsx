import Link from "next/link";
import styles from "@/styles/bottombar.module.scss";
import Image from "next/image";
import { StaticImageData } from "next/image";

// public
import homeImage from "@/public/bottomBar/home.svg";
import searchImage from "@/public/bottomBar/search.svg";
import myShelfImage from "@/public/bottomBar/myshelf.svg";
import communityImage from "@/public/bottomBar/community.svg";
import myPageImage from "@/public/bottomBar/mypage.svg";

// components
import Toast from "../ui/toast";

export default function BottomBar() {
    return (
        <div>
            <Toast />
            <div className={styles.bottomBarWrap}>
                <BottomBarBtn src={homeImage} href="/" aria="홈" />
                <BottomBarBtn src={searchImage} href="/" aria="검색" />
                <BottomBarBtn src={myShelfImage} href="/myshelf" aria="나의 서재" />
                <BottomBarBtn src={communityImage} href="/community" aria="커뮤니티" />
                <BottomBarBtn src={myPageImage} href="/user" aria="마이페이지" />
            </div>
        </div>
    );
}

const BottomBarBtn = ({ src, href, aria }: { src: StaticImageData; href: string; aria: string }) => {
    return (
        <Link className={styles.bottomBarBtn} href={href} aria-label={aria}>
            <Image src={src} width={25} alt="" />
        </Link>
    );
};
