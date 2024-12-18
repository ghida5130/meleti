import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { type } = req.query;
        const response = await axios.get(
            `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_TTB_KEY}&itemIdType=ISBN13&itemId=${type}&output=js&Version=20131101`
        );
        const result = response.data.item;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch best seller data" });
    }
}
