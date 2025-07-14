import { useEffect, useState } from "react";
import { useSecureGetQuery } from "./useSecureGetQuery";
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";

type SizeResult = [number | null, number | null, number | null];

const useBookSize = (isbn: string): SizeResult => {
    const [size, setSize] = useState<SizeResult>([null, null, null]);

    const { data } = useSecureGetQuery<AladinItemLookupType[]>(`/api/books/aladin/lookup?type=${isbn}`, {
        enabled: !!isbn,
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        const packing = data[0].subInfo?.packing;

        if (packing) {
            const { sizeWidth, sizeHeight, sizeDepth } = packing;
            setSize([Number(sizeWidth) || null, Number(sizeHeight) || null, Number(sizeDepth) || null]);
        } else {
            setSize([null, null, null]);
        }
    }, [data]);

    return size;
};

export default useBookSize;
