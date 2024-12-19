"use client";

import Lottie from "react-lottie-player";
import animationData from "@/public/bookLoading.json"; // Lottie JSON 파일 경로

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
