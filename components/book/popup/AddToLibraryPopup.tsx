"use client";

import { useState } from "react";
import styles from "@/styles/book.module.scss";
import { useBook } from "@/providers/BookContext";

// hooks & utils
import { useSecurePostMutation } from "@/hooks/queries/useSecurePostMutation";
import { useToast } from "@/hooks/redux/useToast";
import { useUserData } from "@/hooks/redux/useUserData";
import { useQueryClient } from "@tanstack/react-query";

// components
import ReadBookInfo from "./readBookInfo";
import FinishedBookInfo from "./finishedBookInfo";

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
    startedAt: Date | null;
    finishedAt: Date | null;
    readPage: number;
};

export default function AddToLibraryPopup({ isbn, title, totalPages, cover }: BookTypes) {
    const [isOpen, setIsOpen] = useState(false);
    const [startedAt, setStartedAt] = useState<Date | null>(new Date());
    const [finishedAt, setFinishedAt] = useState<Date | null>(new Date());
    // const [quotes, setQuotes] = useState<string[]>([]);
    const [readPage, setReadPage] = useState("");
    const { setToast } = useToast();
    const { uid, isDemo } = useUserData();
    const queryClient = useQueryClient();

    // 팝업창, 독서상태 관리용 state (Context API)
    const { isPopupOpen, setIsPopupOpen, selectedStatus, setSelectedStatus } = useBook();

    // 사용자 서재에 도서 추가
    const { mutateAsync: addToLibrary, isPending } = useSecurePostMutation<{ success: boolean }, AddToLibraryInput>(
        "/api/users/library"
    );

    // 도서 데이터 사용자 라이브러리에 추가하기 (React-Query)
    const handleAddToLibrary = async () => {
        if (!/^\d+$/.test(readPage) && selectedStatus === "읽는 중인 책") {
            alert("현재 읽은 페이지에는 숫자만 입력해주세요.");
            return;
        }

        if (isDemo) {
            setToast({ message: "데모 계정은 기록을 변경할 수 없습니다", type: "error" });
            return;
        }

        try {
            await addToLibrary({
                isbn,
                status: selectedStatus,
                title,
                totalPages,
                cover,
                startedAt: selectedStatus === "읽고 싶은 책" ? null : startedAt,
                finishedAt: selectedStatus === "읽은 책" ? finishedAt : null,
                readPage: selectedStatus === "읽은 책" ? totalPages : Number(readPage),
            });
            await queryClient.invalidateQueries({ queryKey: [uid] });
            setIsPopupOpen(false);
            setToast({ message: "서재에 추가되었습니다", type: "success" });
        } catch (error) {
            const message = error && typeof error === "object" && "message" in error
                ? String(error.message)
                : "서재에 추가하지 못했습니다";
            setToast({ message, type: "error" });
        }
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
                {selectedStatus === "읽는 중인 책" && (
                    <ReadBookInfo
                        startedAt={startedAt}
                        setStartedAt={setStartedAt}
                        readPage={readPage}
                        setReadPage={setReadPage}
                    />
                )}
                {selectedStatus === "읽은 책" && (
                    <FinishedBookInfo
                        startedAt={startedAt}
                        setStartedAt={setStartedAt}
                        finishedAt={finishedAt}
                        setFinishedAt={setFinishedAt}
                    />
                )}
                <button className={styles.addButton} onClick={handleAddToLibrary} disabled={!selectedStatus || isPending}>
                    추가하기
                </button>
            </div>
        </div>
    );
}
