import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import jwt from "jsonwebtoken";

// 사용자 library 도서 목록 조회
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No access token provided" }, { status: 401 });
        }
        const accessToken = authHeader.split(" ")[1];

        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessSecret) throw new Error("ACCESS_TOKEN_SECRET is not set");

        let decoded;
        try {
            decoded = jwt.verify(accessToken, accessSecret);
        } catch {
            return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
        }

        if (typeof decoded === "string") {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        const uid = decoded.uid;

        if (!uid) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

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
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No access token provided" }, { status: 401 });
        }

        const accessToken = authHeader.split(" ")[1];
        const { isbn, status, title, totalPages, cover } = await req.json();

        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessSecret) throw new Error("ACCESS_TOKEN_SECRET is not set");

        let decoded;
        try {
            decoded = jwt.verify(accessToken, accessSecret);
        } catch {
            return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
        }

        if (typeof decoded === "string") {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        const uid = decoded.uid;

        if (!uid) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library").doc(isbn);

        await libraryRef.set({
            status,
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            title,
            totalPages,
            cover,
            readPage: 0,
            startedAt: 0,
            finishedAt: 0,
            quotes: [],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error adding book:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
