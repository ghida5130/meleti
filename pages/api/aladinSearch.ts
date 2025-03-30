import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { query } = req.query;
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
        res.status(200).json(filteredResult);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch search result data" });
    }
}
