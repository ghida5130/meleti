"use client";

import Image from "next/image";
import styles from "/styles/shelves.module.scss";
import { useEffect, useRef, useState } from "react";

import plusBtn from "/public/myshelf/plus.svg";
// import bookFrontTest from "/public/test/frontTestImage.jpg";
import bookFrontTest2 from "/public/test/frontTestImage2.jpg";
import bookSideTest from "/public/test/sideTestImage.jpg";
import bookInnerImage from "/public/test2.jpg";

export default function Shelves() {
    return (
        <div>
            <Shelf view="front" />
            <Shelf view="side" />
            <Shelf view="front" />
            <Shelf view="side" />
            <Shelf view="front" />
            <Shelf view="side" />
        </div>
    );
}

const Shelf = ({ view }: { view: string }) => {
    const booksArr = [0, 1, 2, 3, 4, 5, 6];
    // const booksArr = [0];
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
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    });

    return (
        <>
            <div className={styles.shelvesBackground}>
                <p>읽고 싶은 책 ▶</p>
                <ul className={styles.booksArea} ref={containerRef} onMouseDown={handleMouseDown}>
                    {view === "front"
                        ? booksArr.map((_, idx) => {
                              return <BookFrontView handleClick={handleClick} key={idx} />;
                          })
                        : booksArr.map((_, idx) => {
                              return <BookSideView handleClick={handleClick} key={idx} />;
                          })}
                    <button className={styles.plusBtn}>
                        {/* height 값은 현재 표시 책중 가장 긴 height값으로 지정해주는게 좋을듯 */}
                        <Image src={plusBtn} alt="plus button" width={50} />
                    </button>
                </ul>
            </div>
            <div className={styles.support} />
        </>
    );
};

const BookFrontView = ({ handleClick }: { handleClick: React.MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button className={styles.frontViewBook} onClick={handleClick}>
            <div className={styles.test}>
                <Image
                    src={bookFrontTest2}
                    alt="book"
                    width={105}
                    draggable="false"
                    style={{ transform: "skew(0, -2deg) translateY(2px)" }}
                />
                <div className={styles.sideImageArea}>
                    <Image src={bookInnerImage} alt="book" draggable="false" fill />
                </div>
            </div>
            <div className={styles.frontBookImageInnerPageNum}>204 / 352p</div>
            <div className={styles.frontBookImageInnerTitle}>멸망 이전의 샹그릴라1111</div>
        </button>
    );
};

const BookSideView = ({ handleClick }: { handleClick: React.MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button className={styles.SideViewBook} onClick={handleClick}>
            <Image src={bookSideTest} alt="book" width={20} draggable="false" />
        </button>
    );
};
