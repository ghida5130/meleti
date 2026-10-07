import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifySession } from "@/lib/auth/session";
import { getDemoBooks } from "@/lib/demo/books";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const result = await verifySession(req);
        if (result instanceof Response) return result;

        const year = req.nextUrl.searchParams.get("year");
        if (!year || !/^\d{4}$/.test(year)) {
            return NextResponse.json({ error: "올바른 연도가 필요합니다" }, { status: 400 });
        }
        const books = result.isDemo
            ? getDemoBooks()
            : (await admin.firestore().collection("users").doc(result.uid).collection("library").get())
                .docs.map((doc) => doc.data());
        const formatter = new Intl.DateTimeFormat("ko-KR", {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
        });
        const counts = new Map<string, number>();
        for (const book of books) {
            if (book.status !== "읽은 책" || typeof book.finishedAt !== "string") continue;
            const date = new Date(book.finishedAt);
            if (Number.isNaN(date.getTime())) continue;
            const parts = formatter.formatToParts(date);
            const bookYear = parts.find((part) => part.type === "year")?.value;
            const month = parts.find((part) => part.type === "month")?.value;
            if (bookYear !== year || !month) continue;
            const key = `${year.slice(2)}.${month.padStart(2, "0")}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        const data = Array.from(counts).map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));

        return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("사용자 월별 독서량 조회 실패:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
