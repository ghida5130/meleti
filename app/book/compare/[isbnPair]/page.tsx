import BookComparePage from "@/components/pages/book/bookComparePage";

export const metadata = {
    title: "Meleti 도서 비교",
};

export default async function Compare({ params }: { params: { isbnPair: string } }) {
    return <BookComparePage isbnPair={params.isbnPair} />;
}
