"use client";

import { CSSProperties, useEffect, useId, useRef, useState } from "react";
import styles from "./bottomBar.module.scss";

export default function BottomBarGlass({ className = "", bezel = 4 }: { className?: string; bezel?: number }) {
    const glassRef = useRef<HTMLSpanElement>(null);
    const filterId = `bottom-glass-${useId().replace(/:/g, "")}`;
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const glass = glassRef.current;
        // SVG 배경 굴절을 지원하는 Chromium에서만 렌즈 활성화
        if (!glass || !/Chrome|Chromium|Edg/.test(navigator.userAgent)) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.contentRect.width);
            const height = Math.round(entry.contentRect.height);
            setSize((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
        });
        observer.observe(glass);
        return () => observer.disconnect();
    }, []);

    const { width, height } = size;
    const hasSize = width > 0 && height > 0;
    const glassStyle = hasSize
        ? ({ "--glass-backdrop": `blur(var(--glass-blur, 1px)) url("#${filterId}") blur(0.6px) saturate(1.4) brightness(1.04)` } as CSSProperties)
        : undefined;

    // 중앙은 유지하고 둥근 가장자리만 굴절시키는 실제 크기의 변위 맵 생성
    const displacementMap = hasSize
        ? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="x"><stop stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>
                <linearGradient id="y" x2="0" y2="1"><stop stop-color="#0f0"/><stop offset="1" stop-color="#000"/></linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="#000080"/>
            <rect width="100%" height="100%" fill="url(#x)" style="mix-blend-mode:screen"/>
            <rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/>
            <rect x="${bezel}" y="${bezel}" width="${width - bezel * 2}" height="${height - bezel * 2}" rx="${height / 2 - bezel}" fill="#808080" style="filter:blur(${bezel * 0.75}px)"/>
        </svg>`)}`
        : undefined;

    return (
        <span ref={glassRef} className={`${styles.glass} ${className}`} style={glassStyle} aria-hidden="true">
            {hasSize && (
                <svg width="0" height="0" focusable="false">
                    <defs>
                        <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                            <feImage width={width} height={height} href={displacementMap} result="lens" />
                            <feDisplacementMap in="SourceGraphic" in2="lens" scale="38" xChannelSelector="R" yChannelSelector="G" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                            <feDisplacementMap in="SourceGraphic" in2="lens" scale="37" xChannelSelector="R" yChannelSelector="G" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                            <feDisplacementMap in="SourceGraphic" in2="lens" scale="36" xChannelSelector="R" yChannelSelector="G" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
                            <feBlend in="red" in2="green" mode="screen" result="redGreen" />
                            <feBlend in="redGreen" in2="blue" mode="screen" />
                        </filter>
                    </defs>
                </svg>
            )}
        </span>
    );
}
