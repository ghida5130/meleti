import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export interface AladinItemLookupType {
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    isbn13: string;
    description: string;
    cover: string;
    categoryName: string;
    subInfo: {
        subTitle: string;
        originalTitle: string;
        itemPage: number;
        packing: {
            styleDesc: string;
            weight: number;
            sizeDepth: number;
            sizeHeight: number;
            sizeWidth: number;
        };
    };
    [key: string]: unknown;
}

// Aladin에서 도서 상세정보 조회
// req: 도서 ISBN
// res: 도서 상세정보
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        if (!type) {
            return NextResponse.json({ error: "쿼리 파라미터 없음: type" }, { status: 400 });
        }

        const response = await axios.get(
            `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&itemIdType=ISBN13&itemId=${type}&output=js&Version=20131101&OptResult=packing`
        );

        const result: AladinItemLookupType[] = response.data.item;
        const keysToRemain = [
            "title",
            "author",
            "publisher",
            "pubDate",
            "isbn13",
            "description",
            "cover",
            "categoryName",
            "subInfo",
        ];

        const filteredResult = result.map((val) =>
            Object.keys(val).reduce((acc, key) => {
                if (keysToRemain.includes(key)) {
                    acc[key as keyof AladinItemLookupType] = val[key];
                }
                return acc;
            }, {} as Partial<AladinItemLookupType>)
        );

        return NextResponse.json(filteredResult[0]);
    } catch (error) {
        console.error("알라딘 ItemLookUp 도서 조회 에러 : ", error);
        return NextResponse.json({ error: "알라딘 ItemLookUp 도서 조회 실패" }, { status: 500 });
    }
}
