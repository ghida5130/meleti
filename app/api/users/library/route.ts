import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifySession } from "@/lib/auth/session";
import { checkOrigin } from "@/lib/auth/checkOrigin";
import { getDemoBooks } from "@/lib/demo/books";

export interface UsersBookInfo {
    id: string;
    addedAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    cover: string;
    finishedAt: string;
    quotes: string[];
    readPage: number;
    startedAt: string;
    status: string;
    title: string;
    totalPages: number;
}

// 사용자 서재 목록 조회
// - req: 세션 쿠키
// res: 사용자 서재 목록
export async function GET(req: NextRequest) {
    try {
        const result = await verifySession(req);
        if (result instanceof Response) return result;
        if (result.isDemo) return NextResponse.json(getDemoBooks(), { headers: { "Cache-Control": "no-store" } });
        const { uid } = result;

        // 사옹자 서재 컬렉션 가져오기
        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library");
        const snapshot = await libraryRef.get();

        const books = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                addedAt: data.addedAt ?? "",
                cover: data.cover ?? "",
                finishedAt: data.finishedAt ?? "",
                quotes: data.quotes ?? [],
                readPage: data.readPage ?? 0,
                startedAt: data.startedAt ?? "",
                status: data.status ?? "",
                title: data.title ?? "",
                totalPages: data.totalPages ?? 0,
            };
        });

        return NextResponse.json(books, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("사용자 서재 정보 불러오기 실패", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// 사용자 library에 도서 추가
export async function POST(req: NextRequest) {
    const originError = checkOrigin(req);
    if (originError) return originError;
    try {
        const result = await verifySession(req, true);
        if (result instanceof Response) return result;
        const { uid } = result;

        const { isbn, status, title, totalPages, cover, startedAt, finishedAt, readPage } = await req.json();

        const allowedStatuses = ["읽고 싶은 책", "읽는 중인 책", "읽은 책"];
        const finishDate = finishedAt ? new Date(finishedAt) : null;
        const startDate = startedAt ? new Date(startedAt) : null;
        if (
            typeof isbn !== "string" || !/^\d{13}$/.test(isbn) ||
            typeof title !== "string" || !title.trim() ||
            typeof cover !== "string" || !cover.startsWith("https://image.aladin.co.kr/") ||
            !allowedStatuses.includes(status) ||
            !Number.isInteger(totalPages) || totalPages < 0 ||
            !Number.isInteger(readPage) || readPage < 0 || (totalPages > 0 && readPage > totalPages) ||
            (startedAt != null && (!startDate || Number.isNaN(startDate.getTime()))) ||
            (finishedAt != null && (!finishDate || Number.isNaN(finishDate.getTime()))) ||
            (status === "읽은 책" && !finishDate) ||
            (startDate && finishDate && startDate > finishDate)
        ) {
            return NextResponse.json({ error: "도서 기록 입력값이 올바르지 않습니다" }, { status: 400 });
        }

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library").doc(isbn);

        await db.runTransaction(async (transaction) => {
            const existing = await transaction.get(libraryRef);

            if (existing.exists) throw new Error("이미 추가된 도서입니다");

            transaction.set(libraryRef, {
                status,
                addedAt: admin.firestore.FieldValue.serverTimestamp(),
                title,
                totalPages,
                cover,
                readPage,
                startedAt,
                finishedAt,
                quotes: [],
            });
        });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "이미 추가된 도서입니다") {
            return NextResponse.json({ error: "이미 추가된 도서입니다" }, { status: 409 });
        }
        console.error("사용자 서재 도서 추가 실패 : ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
