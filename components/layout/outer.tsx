import Image from "next/image";
import innerImage from "@/public/ui/study.jpg";
import logoImage from "@/public/ui/meletiLogo.png";
import styles from "/styles/outer.module.scss";
import qrImage from "@/public/ui/qr_test.png";
import Link from "next/link";

export default function Outer() {
    return (
        <div className={styles.wrap}>
            <Link href="/">
                {/* 메인폰트 : 학교안심 우주, 델타폰트 : 나눔스퀘어 라운드 Light */}
                <Image src={logoImage} alt="meleti" width={150}></Image>
            </Link>
            <p>나만의 모바일 서재</p>
            <div className={styles.imageWrap}>
                <Image src={innerImage} alt="inner image" width={448} />
            </div>
            <p style={{ fontSize: "25px" }}>모바일 접속 QR코드</p>
            <Image src={qrImage} alt="mobile qr code" width={120} />
        </div>
    );
}
