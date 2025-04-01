// app/books/[bookId]/head.tsx
export default async function Head({ params }: { params: { bookNum: string } }) {
    const isbn13 = params.bookNum;
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/aladinItemLookUp?type=${isbn13}`);
    let book = await res.json();
    book = book[0];

    const jsonLD = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "author": {
            "@type": "Person",
            "name": book.author,
        },
        "publisher": {
            "@type": "Organization",
            "name": book.publisher,
        },
        "datePublished": book.pubDate,
        "isbn": book.isbn,
        "description": book.description,
        "image": book.cover,
        "category": book.categoryName,
        "numberOfPages": book.subInfo.itemPage,
        "url": `https://meleti-sigma.vercel.app/book/${params.bookNum}`,
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }} />
        </>
    );
}
