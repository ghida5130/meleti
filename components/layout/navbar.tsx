import Link from "next/link";
import styles from "./navbar.module.scss";
import Image from "next/image";

// components
import logoImage from "@/public/ui/meletiLogo.png";
import searchBtn from "@/public/ui/searchBtn.svg";

export default function Navbar() {
    return (
        <div className={styles.navbarWrap}>
            <Link href="/">
                <Image src={logoImage} width={80} alt="logoImage" />
            </Link>
            <Link href="/search" className={styles.searchBtn} aria-label="도서 검색">
                <Image src={searchBtn} alt="" width={20} height={20} />
            </Link>
        </div>
    );
}
