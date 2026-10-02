import type { Metadata } from "next";
import BookCompareSelectPage from "@/components/pages/book/bookCompareSelectPage";

export const metadata: Metadata = {
  title: "Meleti - 도서 비교",
};

export default function Select({ searchParams }: { searchParams: { base?: string | string[] } }) {
  const baseIsbn = typeof searchParams.base === "string" ? searchParams.base : null;
  return <BookCompareSelectPage baseIsbn={baseIsbn} />;
}
