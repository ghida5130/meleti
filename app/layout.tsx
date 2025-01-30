import type { Metadata } from "next";
import "./globals.scss";
import styles from "/styles/layout.module.scss";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Inner from "../components/layout/inner";
import BottomBar from "../components/layout/bottomBar";

export const metadata: Metadata = {
    title: "Meleti",
    description: "나만의 서재를 만들고 독서를 시작해보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
