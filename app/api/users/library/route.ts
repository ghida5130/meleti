import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifyAccessToken } from "@/lib/auth/verifyAccessToken";

// 사용자 library 도서 목록 조회
export async function GET(req: NextRequest) {
    try {
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library");

        const snapshot = await libraryRef.get();

        const books = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                addedAt: data.addedAt ?? "",
                cover: data.cover ?? "",
                finishedAt: data.finishedAt ?? 0,
                quotes: data.quotes ?? [],
                readPage: data.readPage ?? 0,
                startedAt: data.startedAt ?? 0,
                status: data.status ?? "",
                title: data.title ?? "",
                totalPages: data.totalPages ?? 0,
            };
        });

        return NextResponse.json(books);
    } catch (error) {
        console.error("사용자 서재 정보 불러오기 실패", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// 사용자 library에 도서 추가
export async function POST(req: NextRequest) {
    try {
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        const { isbn, status, title, totalPages, cover, startedAt, finishedAt, readPage } = await req.json();

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library").doc(isbn);

        await libraryRef.set({
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

        console.log("사용자 서재 도서 추가 완료");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("사용자 서재 도서 추가 실패 : ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
