import { NextResponse } from "next/server";

export function checkOrigin(req: Request): Response | null {
    const origin = req.headers.get("origin");
    if (origin === new URL(req.url).origin) return null;
    return NextResponse.json({ error: "허용되지 않은 요청 출처입니다" }, { status: 403 });
}
