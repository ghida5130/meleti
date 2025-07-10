import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST() {
    try {
        // 데모 유저 더미 데이터
        const uid = "demo_user";
        const email = "demo@example.com";
        const name = "Demo User";
        const role = "demo";

        // access, refresh token 생성
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret || !refreshSecret) throw new Error("Token secret is not set");

        const accessToken = jwt.sign({ uid, email, role, isDemo: true }, accessSecret, {
            expiresIn: "15m",
            issuer: "meleti",
        });

        const refreshToken = jwt.sign({ uid }, refreshSecret, { expiresIn: "7d", issuer: "meleti" });

        const refreshCookie = serialize("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "strict",
        });

        const response = NextResponse.json({
            uid,
            email,
            name,
            isNewUser: false,
            role,
            accessToken,
        });

        response.headers.set("Set-Cookie", refreshCookie);

        console.log(`데모 로그인: ${email} ${uid}`);

        return response;
    } catch (error) {
        console.error("Demo login error:", error);
        return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
    }
}
