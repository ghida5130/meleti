import Image from "next/image";
import innerImage from "@/public/study.jpg";
import logoImage from "@/public/meletiLogo.png";
import styles from "/styles/inner.module.scss";
import qrImage from "@/public/qr_test.png";

export default function Inner() {
    return (
        <div className={styles.wrap}>
            <div>
                {/* 메인폰트 : 학교안심 우주, 델타폰트 : 나눔스퀘어 라운드 Light */}
                <Image src={logoImage} alt="meleti" width={150}></Image>
            </div>
            <h2>나만의 모바일 서재</h2>
            <div className={styles.imageWrap}>
                <Image src={innerImage} alt="inner image" width={448} />
            </div>
            <p style={{ fontSize: "25px" }}>모바일 접속 QR코드</p>
            <Image src={qrImage} alt="mobile qr code" width={120} />
        </div>
    );
}
