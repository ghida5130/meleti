import type { UsersBookInfo } from "@/app/api/users/library/route";

export function getDemoBooks(): UsersBookInfo[] {
    const year = new Date().getFullYear();
    const addedAt = Math.floor(new Date(year, 0, 12).getTime() / 1000);

    return [
        {
            id: "9788936434120",
            addedAt: { _seconds: addedAt, _nanoseconds: 0 },
            cover: "/test/frontTestImage.jpg",
            finishedAt: new Date(year, 1, 12).toISOString(),
            quotes: [],
            readPage: 341,
            startedAt: new Date(year, 0, 12).toISOString(),
            status: "읽은 책",
            title: "데모 독서 기록",
            totalPages: 341,
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
