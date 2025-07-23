// app/api/books/aladin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAladinItems } from "@/lib/api/fetchAladinItems";

// Aladin에서 타입에 따른 도서 목록 조회 (베스트셀러, 신간, 블로그)
// req: 조회할 타입
// res: 조회 결과
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
