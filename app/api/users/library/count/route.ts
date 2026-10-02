import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifySession } from "@/lib/auth/session";
import { getDemoBooks } from "@/lib/demo/books";

export const dynamic = "force-dynamic";

export type CountByStatusType = {
    finished: number;
    wish: number;
    reading: number;
};

// 사용자 서재 카테고리별 개수 반환
// - req: 세션 쿠키
// res: 사용자 서재 카테고리별 개수
export async function GET(req: NextRequest) {
    try {
        const result = await verifySession(req);
        if (result instanceof Response) return result;
        if (result.isDemo) {
            const books = getDemoBooks();
            return NextResponse.json({
                finished: books.filter((book) => book.status === "읽은 책").length,
                wish: books.filter((book) => book.status === "읽고 싶은 책").length,
                reading: books.filter((book) => book.status === "읽는 중인 책").length,
            }, { headers: { "Cache-Control": "no-store" } });
        }
        const { uid } = result;

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library");
        const snapshot = await libraryRef.get();

        // 초기값
        const countByStatus: CountByStatusType = {
            finished: 0,
            wish: 0,
            reading: 0,
        };

        snapshot.forEach((doc) => {
            const status = doc.data().status;
            if (status === "읽은 책") countByStatus.finished += 1;
            else if (status === "읽고 싶은 책") countByStatus.wish += 1;
            else if (status === "읽는 중인 책") countByStatus.reading += 1;
        });

        return NextResponse.json<CountByStatusType>(countByStatus, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("서재 카테고리별 개수 불러오기 실패 : ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
