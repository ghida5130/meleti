export default async function Detail({ params }: { params: Promise<{ bookNum: string }> }) {
    const test = (await params).bookNum;
    return <div>{test}</div>;
}
