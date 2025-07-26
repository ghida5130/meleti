import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";
import BookDetailPage from "@/components/pages/book/bookDetailpage";

// 동적 메타데이터
export async function generateMetadata({ params }: { params: { bookNum: string } }) {
    const isbn13 = params.bookNum;
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn13}`, {
        next: { revalidate: 0 },
    });
    const book = (await res.json()) as AladinItemLookupType;

    // Metadata
    return {
        title: `${book.title} : Meleti`,
        description: book.description,
        openGraph: {
            title: book.title,
            description: book.description,
            images: [book.cover],
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: book.description,
            images: [book.cover],
        },
        alternates: {
            canonical: `https://meleti-sigma.vercel.app/book/${params.bookNum}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function Book({ params }: { params: { bookNum: string } }) {
    return <BookDetailPage bookNum={params.bookNum} />;
}
