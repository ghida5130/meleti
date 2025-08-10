import MyShelfDetailPage from "@/components/pages/myShelf/myShelfDetailPage";

export const metadata = {
    title: "Meleti 서재",
};

export default async function Detail({ params }: { params: Promise<{ bookNum: string }> }) {
    const isbn = (await params).bookNum;
    return <MyShelfDetailPage isbn={isbn} />;
}
