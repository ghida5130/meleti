// app/api/proxy-image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const path = searchParams.get("path");

    if (!path) {
        return new NextResponse("Missing path", { status: 400 });
    }

    const targetURL = `https://image.aladin.co.kr/product/${path}`;

    try {
        const res = await fetch(targetURL, {
            headers: {
                // 쿠키나 User-Agent 등 필요한 헤더를 여기에 추가할 수 있음
                "User-Agent": req.headers.get("user-agent") || "",
            },
        });

        if (!res.ok) {
            return new NextResponse("Failed to fetch image", { status: res.status });
        }

        const contentType = res.headers.get("content-type") || "image/jpeg";
        const buffer = await res.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (err) {
        return new NextResponse("Error fetching image" + err, { status: 500 });
    }
}
