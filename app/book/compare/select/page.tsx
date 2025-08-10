"use client";

import { useSearchParams } from "next/navigation";
import BookCompareSelectPage from "@/components/pages/book/bookCompareSelectPage";

export default function Select() {
    const searchParams = useSearchParams();
    const baseIsbn = searchParams.get("base");

    return <BookCompareSelectPage baseIsbn={baseIsbn} />;
}
