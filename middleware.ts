import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const hasRefresh = req.cookies.get("refreshToken")?.value;
    if (!hasRefresh) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/myshelf/:path*", "/user/:path*"],
};
