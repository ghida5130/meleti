import type { Metadata } from "next";
import "./tailwind.css";
import "./globals.scss";
import styles from "./layout.module.scss";
import { suit } from "@/lib/fonts";

// 하단 메뉴의 첫 내부 이동 시 스타일이 늦게 적용되지 않도록 주요 화면의 CSS를 초기 로드에 포함
import "@/components/mainPage/home.module.scss";
import "@/components/mainPage/carousel.module.scss";
import "@/components/skeletons/carouselSkeleton.module.scss";
import "@/components/search/search.module.scss";
import "@/components/myshelf/myshelf.module.scss";
import "@/components/pages/community/communityPage.module.scss";
import "@/components/myPage/mypage.module.scss";
import "@/components/myPage/chartSkeleton.module.scss";
import "@/components/login/login.module.scss";

// providers
import { QueryProvider } from "@/providers/QueryProvider";
import StoreProvider from "@/providers/storeProvider";

// components
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Outer from "@/components/layout/outer";
import BottomBar from "../components/layout/bottomBar";
import SessionInitializer from "@/components/auth/sessionInitializer";
import AgentationDevTools from "@/components/agentationDevTools";

export const metadata: Metadata = {
  title: "Meleti - 나만의 모바일 서재",
  description: "나만의 서재를 만들고 독서를 시작해보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={suit.className}>
      <body>
        <div className={styles.pageWrap}>
          <StoreProvider>
            <SessionInitializer />
            <Outer />
            <div className={styles.main}>
              <Navbar />
              <QueryProvider>{children}</QueryProvider>
              <Footer />
              <BottomBar />
            </div>
          </StoreProvider>
        </div>
        <AgentationDevTools />
      </body>
    </html>
  );
}
