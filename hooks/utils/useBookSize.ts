import { useEffect, useState } from "react";
import { AladinItemLookupType } from "@/app/api/books/aladin/lookup/route";
import { usePublicGetQuery } from "../queries/usePublicGetQuery";

type SizeResult = [number | null, number | null, number | null];

type UseBookSizeReturn = {
    size: SizeResult;
    isLoading: boolean;
    error: unknown;
};

const useBookSize = (isbn: string): UseBookSizeReturn => {
    const [size, setSize] = useState<SizeResult>([null, null, null]);

    const { data, isLoading, error } = usePublicGetQuery<AladinItemLookupType>(
        `/api/books/aladin/lookup?type=${isbn}`,
        {
            enabled: !!isbn,
        }
    );

    useEffect(() => {
        if (!data) {
            return;
        }

        const packing = data.subInfo?.packing;

        if (packing) {
            const { sizeWidth, sizeHeight, sizeDepth } = packing;
            setSize([Number(sizeWidth) || null, Number(sizeHeight) || null, Number(sizeDepth) || null]);
        } else {
            setSize([null, null, null]);
        }
    }, [data]);

    return { size, isLoading, error };
};

export default useBookSize;
