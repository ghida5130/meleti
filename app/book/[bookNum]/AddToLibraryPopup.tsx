"use client";

import { useState } from "react";
import styles from "/styles/book.module.scss";
import { useBook } from "./BookContext";
import { useSecurePostMutation } from "@/hooks/useSecurePostMutation";

interface BookTypes {
    isbn: string;
    title: string;
    totalPages: number;
    cover: string;
}

type AddToLibraryInput = {
    isbn: string;
    status: string;
    title: string;
    totalPages?: number;
    cover?: string;
};

export default function AddToLibraryPopup({ isbn, title, totalPages, cover }: BookTypes) {
    const [isOpen, setIsOpen] = useState(false);

    // 팝업창, 독서상태 관리용 state (Context API)
    const { isPopupOpen, setIsPopupOpen, selectedStatus, setSelectedStatus } = useBook();

    // secureMutate 테스트
    const { mutate: addToLibrary } = useSecurePostMutation<{ message: string }, AddToLibraryInput>("/api/library", {
        onSuccess: (data) => {
            console.log("사용자 서재 도서 추가 완료", data.message);
        },
        onError: (err) => {
            console.error(`사용자 서재 도서 추가 에러 (${err.status}): ${err.message}`);
        },
    });

    // 도서 데이터 사용자 라이브러리에 추가하기 (React-Query)

    // const { mutate } = useAddToLibrary();
    const handleAddToLibrary = async () => {
        addToLibrary({
            isbn,
            status: selectedStatus,
            title,
            totalPages,
            cover,
        });

        setIsPopupOpen(false);
    };

    if (!isPopupOpen) return null;

    return (
        <div className={styles.popupArea}>
            <div className={styles.popup}>
                <h3>내 서재에 추가하기</h3>
                <button className={styles.closeButton} onClick={() => setIsPopupOpen(!isPopupOpen)}></button>
                <div className={styles.bookStatus}>
                    <div className={styles.selectWrapper}>
                        <button
                            className={`${styles.selectButton} ${isOpen ? styles.open : ""}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {selectedStatus || "책 상태 선택"}
                        </button>
                        <div className={`${styles.dropdownList} ${isOpen ? styles.open : ""}`}>
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setSelectedStatus("읽는 중인 책");
                                    setIsOpen(false);
                                }}
                            >
                                읽는 중인 책
                            </div>
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setSelectedStatus("읽고 싶은 책");
                                    setIsOpen(false);
                                }}
                            >
                                읽고 싶은 책
                            </div>
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setSelectedStatus("읽은 책");
                                    setIsOpen(false);
                                }}
                            >
                                읽은 책
                            </div>
                        </div>
                    </div>
                </div>
                <button className={styles.addButton} onClick={handleAddToLibrary} disabled={!selectedStatus}>
                    추가하기
                </button>
            </div>
        </div>
    );
}
