import type { Metadata } from "next";
import "./globals.scss";
import styles from "/styles/layout.module.scss";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Inner from "../components/layout/inner";
import BottomBar from "../components/layout/bottomBar";
import { QueryProvider } from "@/providers/QueryProvider";
import StoreProvider from "./storeProvider";

export const metadata: Metadata = {
    title: "Meleti",
    description: "나만의 서재를 만들고 독서를 시작해보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <div className={styles.pageWrap}>
                    <StoreProvider>
                        <Inner />
                        <div className={styles.main}>
                            <Navbar />
                            <QueryProvider>{children}</QueryProvider>
                            <Footer />
                            <BottomBar />
                        </div>
                    </StoreProvider>
                </div>
            </body>
        </html>
    );
}
