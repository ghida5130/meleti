import { NextResponse } from "next/server";

// refreshToken 만료로 로그아웃 처리
// res: 만료된 refreshToken
export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });

    // refreshToken 쿠키 무효화
    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0), // 즉시 만료
    });

    return response;
}
