import type { Metadata } from "next";
import "./globals.scss";
import styles from "/styles/layout.module.scss";
import Navbar from "./navbar";
import Footer from "./footer";
import Inner from "./inner";
import BottomBar from "./bottomBar";

export const metadata: Metadata = {
    title: "Meleti : 나만의 모바일 서재",
    description: "나만의 서재를 만들고 독서를 시작해보세요.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className={styles.pageWrap}>
                    <Inner />
                    <div className={styles.main}>
                        <Navbar />
                        {children}
                        <Footer />
                        <BottomBar />
                    </div>
                </div>
            </body>
        </html>
    );
}
