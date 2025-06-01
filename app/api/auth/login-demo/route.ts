import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST() {
    try {
        // 데모 유저 더미 데이터
        const uid = "demo_user";
        const email = "demo@example.com";
        const name = "Demo User";
        const role = "demo";

        // access, refresh token 생성
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessSecret) throw new Error("Token secret is not set");

        const accessToken = jwt.sign(
            { uid, email, role, isDemo: true }, // isDemo flag 추가
            accessSecret,
            { expiresIn: "15m", issuer: "meleti" }
        );

        const response = NextResponse.json({
            uid,
            email,
            name,
            isNewUser: false,
            role,
            accessToken,
        });

        console.log(`데모 로그인: ${email} ${uid}`);

        return response;
    } catch (error) {
        console.error("Demo login error:", error);
        return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
    }
}
