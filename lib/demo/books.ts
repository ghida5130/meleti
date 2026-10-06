import type { UsersBookInfo } from "@/app/api/users/library/route";

export function getDemoBooks(): UsersBookInfo[] {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = Math.min(today.getDate(), 20);
    const completedBooks = [
        { id: "9788936434120", title: "데모 독서 기록 · 작은 습관", totalPages: 341, monthsAgo: 0 },
        { id: "9780000000002", title: "데모 독서 기록 · 일상의 발견", totalPages: 224, monthsAgo: 0 },
        { id: "9780000000003", title: "데모 독서 기록 · 생각 정리", totalPages: 280, monthsAgo: 1 },
        { id: "9780000000004", title: "데모 독서 기록 · 나만의 속도", totalPages: 192, monthsAgo: 2 },
        { id: "9780000000005", title: "데모 독서 기록 · 읽는 즐거움", totalPages: 256, monthsAgo: 2 },
        { id: "9780000000006", title: "데모 독서 기록 · 새로운 시선", totalPages: 308, monthsAgo: 3 },
        { id: "9780000000007", title: "데모 독서 기록 · 마음의 여유", totalPages: 216, monthsAgo: 4 },
        { id: "9780000000008", title: "데모 독서 기록 · 기록의 힘", totalPages: 272, monthsAgo: 4 },
        { id: "9780000000009", title: "데모 독서 기록 · 첫 번째 문장", totalPages: 180, monthsAgo: 5 },
    ];
    const addedAt = Math.floor(new Date(year, month, 1).getTime() / 1000);

    return [
        ...completedBooks.map((book, index) => {
            // - 연초에도 올해 차트에 표시되도록 완독 월을 1월 이후로 설정
            const finishedMonth = Math.max(0, month - book.monthsAgo);
            const startedAt = new Date(year, finishedMonth, 1);

            return {
                id: book.id,
                addedAt: { _seconds: Math.floor(startedAt.getTime() / 1000), _nanoseconds: 0 },
                cover: index % 2 === 0 ? "/test/frontTestImage.jpg" : "/test/frontTestImage2.jpg",
                finishedAt: new Date(year, finishedMonth, day).toISOString(),
                quotes: [],
                readPage: book.totalPages,
                startedAt: startedAt.toISOString(),
                status: "읽은 책",
                title: book.title,
                totalPages: book.totalPages,
            };
        }),
        {
            id: "9780000000010",
            addedAt: { _seconds: addedAt, _nanoseconds: 0 },
            cover: "/test/frontTestImage.jpg",
            finishedAt: "",
            quotes: [],
            readPage: 120,
            startedAt: new Date(year, month, 1).toISOString(),
            status: "읽는 중인 책",
            title: "읽는 중인 데모 도서",
            totalPages: 320,
        },
        {
            id: "9788934972464",
            addedAt: { _seconds: addedAt, _nanoseconds: 0 },
            cover: "/test/frontTestImage2.jpg",
            finishedAt: "",
            quotes: [],
            readPage: 0,
            startedAt: "",
            status: "읽고 싶은 책",
            title: "읽고 싶은 데모 도서",
            totalPages: 200,
        },
    ];
}
