import axios from "axios";
import { AladinItemsType } from "@/types/aladin";

const keysToRemain = ["title", "author", "isbn", "isbn13", "itemid", "cover"];

export async function fetchAladinItems(type: string): Promise<AladinItemsType[]> {
    const response = await axios.get(
        `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&QueryType=${type}&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`
    );

    const result: AladinItemsType[] = response.data.item;

    console.log("알라딘 기본 데이터");

    return result.map((val) =>
        Object.keys(val).reduce((acc, key) => {
            if (keysToRemain.includes(key)) {
                acc[key as keyof AladinItemsType] = val[key];
            }
            return acc;
        }, {} as AladinItemsType)
    );
}
