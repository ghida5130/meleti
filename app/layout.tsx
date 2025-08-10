import type { Metadata } from "next";
import "./globals.scss";
import styles from "@/styles/layout.module.scss";
import { suit } from "@/lib/fonts";

// providers
import { QueryProvider } from "@/providers/QueryProvider";
import StoreProvider from "@/providers/storeProvider";

// components
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Outer from "@/components/layout/outer";
import BottomBar from "../components/layout/bottomBar";
import AccessTokenInitializer from "@/components/auth/accessTokenInitializer";
import Prefetcher from "@/providers/preFetcher";

export const metadata: Metadata = {
    title: "Meleti 나만의 모바일 서재",
    description: "나만의 서재를 만들고 독서를 시작해보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" className={suit.className}>
            <Prefetcher />
            <body>
                <div className={styles.pageWrap}>
                    <StoreProvider>
                        <AccessTokenInitializer />
                        <Outer />
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
