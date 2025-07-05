"use client";
import { useEffect, useState } from "react";

export default function Book3D({ cover }: { cover: string }) {
    const [BookImage, setBookImage] = useState<React.ComponentType<{ cover: string }> | null>(null);

    useEffect(() => {
        const load = () => {
            import("./bookImage").then((mod) => {
                setBookImage(() => mod.default);
            });
        };

        if ("requestIdleCallback" in window) {
            (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(load);
        } else {
            setTimeout(load, 2000);
        }
    }, []);

    if (!BookImage) return <div style={{ height: "500px", width: "100%" }}>Loading 3D Book...</div>;
    return <BookImage cover={cover} />;
}
