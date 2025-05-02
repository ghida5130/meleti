import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
    const session = await auth();
    const isLoginPage = req.nextUrl.pathname === "/login";

    if (!session && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// 적용할 경로 설정
export const config = {
    matcher: ["/mypage/:path*", "/myshelf/:path*", "/community/post/:path*"], // 보호할 경로들
};
