import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebasedb";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
    const { email, isbn, status, title, totalPages, cover } = await req.json();

    if (!email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const libraryRef = doc(db, "users", email, "library", isbn);
    await setDoc(libraryRef, {
        status: status,
        addedAt: serverTimestamp(),
        title: title,
        totalPages: totalPages,
        cover: cover,
        readPage: 0,
        startedAt: 0,
        finishedAt: 0,
        quotes: [],
    });

    return NextResponse.json({ success: true });
}
