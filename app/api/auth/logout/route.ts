import { NextResponse } from "next/server";
import { checkOrigin } from "@/lib/auth/checkOrigin";
import { clearSessionCookie, deleteSession } from "@/lib/auth/session";

export async function POST(req: Request) {
    const originError = checkOrigin(req);
    if (originError) return originError;

    try {
        await deleteSession(req);
        const response = NextResponse.json({ message: "Logged out" });
        clearSessionCookie(response);
        return response;
    } catch (error) {
        console.error("로그아웃 실패:", error);
        return NextResponse.json({ error: "로그아웃에 실패했습니다" }, { status: 500 });
    }
}
