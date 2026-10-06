"use client";

import styles from "./bottomBar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, useRef } from "react";

// public
import homeImage from "@/public/bottomBar/home.svg";
import searchImage from "@/public/ui/searchBtn.svg";
import myShelfImage from "@/public/bottomBar/myshelf.svg";
import communityImage from "@/public/bottomBar/community.svg";
import myPageImage from "@/public/bottomBar/mypage.svg";

// components
import Toast from "../ui/toast";
import BottomBarGlass from "./bottomBarGlass";
import BottomBarLens from "./bottomBarLens";

const menuItems = [
  { src: homeImage, href: "/", label: "홈", ariaLabel: "홈" },
  { src: searchImage, href: "/search", label: "검색", ariaLabel: "검색" },
  { src: myShelfImage, href: "/myshelf", label: "서재", ariaLabel: "나의 서재" },
  { src: communityImage, href: "/community", label: "커뮤니티", ariaLabel: "커뮤니티" },
  { src: myPageImage, href: "/user", label: "마이", ariaLabel: "마이페이지" },
];

export default function BottomBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
  const activeIndex = menuItems.findIndex(
    ({ href }) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)),
  );
  const barStyle = { "--active-index": Math.max(activeIndex, 0) } as CSSProperties;

  return (
    <>
      <Toast />
      <div className={styles.bottomBarWrap}>
        <nav ref={barRef} className={styles.bottomBar} aria-label="주요 메뉴" style={barStyle}>
          <BottomBarGlass bezel={7} />
          <BottomBarLens barRef={barRef} activeIndex={activeIndex} />
          {menuItems.map(({ src, href, label, ariaLabel }, index) => (
            <Link
              key={href}
              className={styles.bottomBarBtn}
              href={href}
              aria-label={ariaLabel}
              aria-current={activeIndex === index ? "page" : undefined}
            >
              <Image src={src} width={23} height={23} alt="" draggable={false} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
