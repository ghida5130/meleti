import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface AladinNewReleaseType {
    title: string;
    author: string;
    isbn: string;
    isbn13: string;
    itemid: number;
    cover: string;
    [key: string]: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { type } = req.query;
        const response = await axios.get(
            `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&QueryType=${type}&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`
        );
        const result: AladinNewReleaseType[] = response.data.item;
        const keysToRemain = ["title", "author", "isbn", "isbn13", "itemid", "cover"];
        const filteredResult = result.map((val) =>
            Object.keys(val).reduce((acc, key) => {
                if (keysToRemain.includes(key)) {
                    acc[key as keyof AladinNewReleaseType] = val[key];
                }
                return acc;
            }, {} as Partial<AladinNewReleaseType>)
        );
        res.status(200).json(filteredResult);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch best seller data" });
    }
}
