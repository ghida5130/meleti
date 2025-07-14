// app/api/books/aladin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAladinItems } from "@/lib/api/fetchAladinItems";

export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get("type") ?? "BestSeller";

    try {
        const items = await fetchAladinItems(type);
        return NextResponse.json(items);
    } catch (error) {
        console.error("알라딘 ItemList 도서 조회 에러:", error);
        return NextResponse.json({ error: "알라딘 ItemList 도서 조회 실패" }, { status: 500 });
    }
}
