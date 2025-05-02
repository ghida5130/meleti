"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BookContextType {
    isPopupOpen: boolean;
    setIsPopupOpen: (isOpen: boolean) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업창 열림 상태
    const [selectedStatus, setSelectedStatus] = useState(""); // 사용자가 선택한 독서 상태

    return (
        <BookContext.Provider value={{ isPopupOpen, setIsPopupOpen, selectedStatus, setSelectedStatus }}>
            {children}
        </BookContext.Provider>
    );
}

export function useBook() {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error("useBook must be used within a BookProvider");
    }
    return context;
}
