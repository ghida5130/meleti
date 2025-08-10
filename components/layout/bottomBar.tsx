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
                <BottomBarBtn src={homeImage} href="/" ariaLabel="홈" />
                <BottomBarBtn src={searchImage} href="/" ariaLabel="검색" />
                <BottomBarBtn src={myShelfImage} href="/myshelf" ariaLabel="나의 서재" />
                <BottomBarBtn src={communityImage} href="/community" ariaLabel="커뮤니티" />
                <BottomBarBtn src={myPageImage} href="/user" ariaLabel="마이페이지" />
            </div>
        </div>
    );
}

const BottomBarBtn = ({ src, href, ariaLabel }: { src: StaticImageData; href: string; ariaLabel: string }) => {
    return (
        <a className={styles.bottomBarBtn} href={href} aria-label={ariaLabel}>
            <Image src={src} width={25} alt="" />
        </a>
    );
};
