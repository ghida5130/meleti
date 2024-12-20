"use client";

import Lottie from "react-lottie-player";
// import dynamic from "next/dynamic";
import animationData from "@/public/bookLoading.json"; // Lottie JSON 파일 경로

// export const dynamic = "force-dynamic";

// const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const LoadingIcon = () => {
    return (
        <Lottie
            loop
            animationData={animationData}
            play
            style={{ width: 150, height: 150 }} // 크기 조절
        />
    );
};

export default LoadingIcon;
