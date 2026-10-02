import { NextResponse } from "next/server";
import { checkOrigin } from "@/lib/auth/checkOrigin";
import { DEMO_SESSION, deleteSession, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
    const originError = checkOrigin(req);
    if (originError) return originError;

    try {
        await deleteSession(req);
        const response = NextResponse.json({
            uid: "demo_user",
            email: "demo@example.com",
            name: "Demo User",
            userImage: null,
            isDemo: true,
        });
        setSessionCookie(response, DEMO_SESSION);
        return response;
    } catch (error) {
        console.error("데모 로그인 실패:", error);
        return NextResponse.json({ error: "데모 로그인에 실패했습니다" }, { status: 500 });
    }
}
