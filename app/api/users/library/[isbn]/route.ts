import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifySession } from "@/lib/auth/session";
import { getDemoBooks } from "@/lib/demo/books";

export async function GET(req: NextRequest, { params }: { params: { isbn: string } }) {
    const session = await verifySession(req);
    if (session instanceof Response) return session;
    if (!/^\d{13}$/.test(params.isbn)) {
        return NextResponse.json({ error: "ISBN이 올바르지 않습니다" }, { status: 400 });
    }
    if (session.isDemo) {
        const book = getDemoBooks().find((item) => item.id === params.isbn);
        return book
            ? NextResponse.json(book, { headers: { "Cache-Control": "no-store" } })
            : NextResponse.json({ error: "서재에 없는 책입니다" }, { status: 404 });
    }

    try {
        const bookDoc = await admin.firestore().collection("users").doc(session.uid)
            .collection("library").doc(params.isbn).get();
        if (!bookDoc.exists) return NextResponse.json({ error: "서재에 없는 책입니다" }, { status: 404 });
        return NextResponse.json({ id: bookDoc.id, ...bookDoc.data() }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("서재 상세 조회 실패:", error);
        return NextResponse.json({ error: "서재 상세 조회에 실패했습니다" }, { status: 500 });
    }
}
