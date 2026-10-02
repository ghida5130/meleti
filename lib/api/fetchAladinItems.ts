import axios from "axios";
import { AladinItemsType } from "@/types/aladin";

const keysToRemain = ["title", "author", "isbn", "isbn13", "itemid", "cover"];

export async function fetchAladinItems(type: string): Promise<AladinItemsType[]> {
    const ttbKey = process.env.ALADIN_TTB_KEY;
    if (!ttbKey?.trim()) {
        throw new Error("ALADIN_TTB_KEY is not configured.");
    }

    const response = await axios.get("https://www.aladin.co.kr/ttb/api/ItemList.aspx", {
        params: {
            ttbkey: ttbKey,
            QueryType: type,
            MaxResults: 10,
            start: 1,
            SearchTarget: "Book",
            output: "js",
            Version: "20131101",
        },
    });

    const data = response.data as {
        item?: AladinItemsType[];
        totalResults?: number | string;
        errorCode?: string;
    } | null;

    if (!Array.isArray(data?.item)) {
        if (data?.errorCode) {
            throw new Error(`Aladin ItemList request failed (${data.errorCode}).`);
        }
        if (data?.totalResults === 0 || data?.totalResults === "0") {
            return [];
        }
        throw new Error("Aladin ItemList response has no item array.");
    }

    return data.item.map((val) =>
        Object.keys(val).reduce((acc, key) => {
            if (keysToRemain.includes(key)) {
                acc[key as keyof AladinItemsType] = val[key];
            }
            return acc;
        }, {} as AladinItemsType)
    );
}
