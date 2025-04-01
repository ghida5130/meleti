"use client";

import { useEffect, useRef, useState } from "react";
import styles from "/styles/carousel.module.scss";
import Image from "next/image";
import Link from "next/link";

interface CarouselData {
    data?: itemTypes[];
}
interface itemTypes {
    title: string;
    author: string;
    isbn: string;
    isbn13: string;
    itemid: number;
    cover: string;
}

export default function Carousel({ data }: CarouselData) {
    const containerRef = useRef<HTMLUListElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;

        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
        setDragDistance(0);
        container.classList.add("dragging");
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const container = containerRef.current;
        if (!container) return;

        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1; // 드래그 속도 조정
        container.scrollLeft = scrollLeft - walk;

        setDragDistance(Math.abs(x - startX));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        containerRef.current?.classList.remove("dragging");
    };

    const handleClick = (e: React.MouseEvent) => {
        if (dragDistance > 5) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    useEffect(() => {
        if (!containerRef.current) return;
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging]);

    return (
        <div className={styles.wrap} onDragStart={(e) => e.preventDefault()}>
            <ul className={styles.bestSellerWrap} ref={containerRef} onMouseDown={handleMouseDown}>
                {data ? (
                    data.map((val, idx) => {
                        const coverImageUrl = val.cover.replace("coversum", "cover200");
                        const title = val.title.split(" - ")[0];
                        const author = val.author.split(" (지은이)")[0];
                        return (
                            <Link key={`best seller ${idx + 1}`} href={`/book/${val.isbn13}`} onClick={handleClick}>
                                <div className={styles.bestSellerItem}>
                                    <div className={styles.bookImage}>
                                        <Image
                                            src={coverImageUrl}
                                            alt={val.title}
                                            fill
                                            sizes="240px"
                                            style={{ objectFit: "cover", objectPosition: "top" }}
                                        />
                                    </div>
                                    <div className={styles.bestSellerTitleArea}>
                                        <p
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {title}
                                        </p>
                                        <p
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                fontSize: "14px",
                                                color: "grey",
                                            }}
                                        >
                                            {author}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <li>Carousel이 표시될 자리입니다.</li>
                )}
            </ul>
        </div>
    );
}
