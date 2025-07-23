import { useEffect, useState } from "react";

const useImageSize = (url: string): [number | null, number | null] => {
    const [size, setSize] = useState<[number | null, number | null]>([null, null]);

    useEffect(() => {
        if (!url) return;

        const img = new Image();
        img.src = url;
        const handleLoad = () => setSize([img.naturalWidth, img.naturalHeight]);
        const handleError = () => setSize([null, null]);

        img.onload = handleLoad;
        img.onerror = handleError;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [url]);

    return size;
};

export default useImageSize;
