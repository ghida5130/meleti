import CompareBook3D from "@/components/book/compareBook3d";

export default async function Compare({ params }: { params: { isbnPair: string } }) {
    const [isbn1, isbn2] = params.isbnPair.split("_");

    const res1 = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn1}`);
    let book1 = await res1.json();
    book1 = book1[0];

    const res2 = await fetch(`${process.env.SERVER_BASE_URL}/api/books/aladin/lookup?type=${isbn2}`);
    let book2 = await res2.json();
    book2 = book2[0];

    return (
        <div>
            <div>
                <CompareBook3D cover1={book1.cover} cover2={book2.cover} isbn1={isbn1} isbn2={isbn2} />
            </div>
        </div>
    );
}
