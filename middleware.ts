import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const hasSession = req.cookies.get("meletiSession")?.value;
    if (!hasSession) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/myshelf/:path*", "/user/:path*", "/community/post/:path*"],
};
