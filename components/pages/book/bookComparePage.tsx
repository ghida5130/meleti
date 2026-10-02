import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";

// components
import CompareBook3DViewer from "@/components/book/viewer/compareBook3DViewer";
import BookInfo from "@/components/book/compare/bookInfo";

export const metadata = {
    title: "Meleti 도서 비교",
};

export default async function BookComparePage({ isbnPair }: { isbnPair: string }) {
    const [isbn1, isbn2] = isbnPair.split("_");

    const [res1, res2] = await Promise.all([
        // 첫번째 도서
        fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn1}`, {
            next: { revalidate: 0 },
        }),
        // 두번째 도서
        fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn2}`, {
            next: { revalidate: 0 },
        }),
    ]);
    const book1 = (await res1.json()) as AladinItemLookupType;
    const book2 = (await res2.json()) as AladinItemLookupType;

    return (
        <div>
            <CompareBook3DViewer
                cover1={book1.cover}
                cover2={book2.cover}
                packing1={book1.subInfo.packing}
                packing2={book2.subInfo.packing}
            />
            <BookInfo book1={book1} book2={book2} />
        </div>
    );
}
