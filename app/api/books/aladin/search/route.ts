import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

interface AladinSearchResultType {
    customerReviewRank: number;
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    priceStandard: string;
    priceSales: string;
    cover: string;
    isbn13: string;
    [key: string]: unknown;
}

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.get("query");

        if (!query) {
            return NextResponse.json({ error: "쿼리 파라미터 없음: query" }, { status: 400 });
        }

        const response = await axios.get(
            `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&Query=${query}&QueryType=Keyword&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=MidBig`
        );

        const result: AladinSearchResultType[] = response.data.item;

        const keysToRemain = [
            "title",
            "author",
            "publisher",
            "pubDate",
            "priceStandard",
            "priceSales",
            "customerReviewRank",
            "cover",
            "isbn13",
        ];

        const filteredResult = result.map((val) =>
            Object.keys(val).reduce((acc, key) => {
                if (keysToRemain.includes(key)) {
                    acc[key as keyof AladinSearchResultType] = val[key];
                }
                return acc;
            }, {} as Partial<AladinSearchResultType>)
        );

        return NextResponse.json(filteredResult);
    } catch (error) {
        console.error("알라딘 도서 검색 결과 조회 에러 : ", error);
        return NextResponse.json({ error: "알라딘 도서 검색 결과 조회 실패" }, { status: 500 });
    }
}
