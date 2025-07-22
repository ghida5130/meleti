import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";

// components
import CompareBook3DViewer from "@/components/book/viewer/compareBook3DViewer";
import BookInfo from "@/components/book/compare/bookInfo";

export const metadata = {
    title: "Meleti 도서 비교",
};

export default async function Compare({ params }: { params: { isbnPair: string } }) {
    const [isbn1, isbn2] = params.isbnPair.split("_");

    // 첫번째 도서
    const res1 = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn1}`);
    const book1 = (await res1.json()) as AladinItemLookupType;

    // 두번째 도서
    const res2 = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn2}`);
    const book2 = (await res2.json()) as AladinItemLookupType;

    return (
        <div>
            <CompareBook3DViewer cover1={book1.cover} cover2={book2.cover} isbn1={isbn1} isbn2={isbn2} />
            <BookInfo book1={book1} book2={book2} />
        </div>
    );
}
