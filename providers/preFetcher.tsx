"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const routes = ["/", "/myshelf", "/community", "/user"] as const;

type IdleDeadlineLike = { readonly didTimeout: boolean; timeRemaining(): number };
type RequestIdleCallback = (cb: (deadline: IdleDeadlineLike) => void, opts?: { timeout: number }) => number;
type CancelIdleCallback = (handle: number) => void;

export default function Prefetcher() {
    const router = useRouter();

    useEffect(() => {
        const run = () => routes.forEach((r) => router.prefetch(r));

        const w = window as Window & {
            requestIdleCallback?: RequestIdleCallback;
            cancelIdleCallback?: CancelIdleCallback;
        };

        if (typeof w.requestIdleCallback === "function") {
            const handle = w.requestIdleCallback(() => run());
            return () => {
                if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
            };
        }

        const handle = window.setTimeout(run, 0);
        return () => window.clearTimeout(handle);
    }, [router]);

    return null;
}
