import { NextResponse } from "next/server";
import axios from "axios";

interface AladinItemListType {
    title: string;
    author: string;
    isbn: string;
    isbn13: string;
    itemid: number;
    cover: string;
    [key: string]: unknown;
}

export async function GET() {
    try {
        const response = await axios.get(
            `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&QueryType=BestSeller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`
        );

        const result: AladinItemListType[] = response.data.item;
        const keysToRemain = ["title", "author", "isbn", "isbn13", "itemid", "cover"];
        const filteredResult = result.map((val) =>
            Object.keys(val).reduce((acc, key) => {
                if (keysToRemain.includes(key)) {
                    acc[key as keyof AladinItemListType] = val[key];
                }
                return acc;
            }, {} as Partial<AladinItemListType>)
        );

        return NextResponse.json(filteredResult);
    } catch (error) {
        console.error("알라딘 ItemList 도서 조회 에러 : ", error);
        return NextResponse.json({ error: "알라딘 ItemList 도서 조회 실패" }, { status: 500 });
    }
}
