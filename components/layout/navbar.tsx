import Link from "next/link";
import styles from "/styles/navbar.module.scss";
import Image from "next/image";

// components
import logoImage from "@/public/ui/meletiLogo.png";
import searchBtn from "@/public/ui/searchBtn.svg";

export default function Navbar() {
    const keyword = ["도서명으로 검색하기", "작가명으로 검색하기"];
    const recommendKeyword = keyword[Math.floor(Math.random() * keyword.length)];

    return (
        <div className={styles.navbarWrap}>
            <Link href="/">
                <Image src={logoImage} width={80} alt="logoImage" />
            </Link>
            <Link href="/search" className={`${styles.searchBtn}`}>
                <p className={styles.textArea}>{recommendKeyword}</p>
                <Image src={searchBtn} alt="searchButton" width={20} style={{ marginLeft: "10px" }} />
            </Link>
        </div>
    );
}
