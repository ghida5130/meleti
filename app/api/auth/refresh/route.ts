// 사용자 refreshToken을 통해 accessToken을 재발급

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!refreshSecret || !accessSecret) {
            throw new Error("Token secrets are not set");
        }

        // 쿠키에서 refreshToken 가져오기
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
        }

        // refreshToken 유효성 검증
        const decoded = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;

        const uid = decoded.uid;

        // Firestore에서 유저 정보 조회
        const db = admin.firestore();
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const userData = userDoc.data();

        if (!userData) return NextResponse.json({ error: "User not found" }, { status: 401 });

        // 새 accessToken 발급
        const accessToken = jwt.sign(
            {
                uid,
                email: userData.email,
                role: userData.role || "user",
            },
            accessSecret,
            {
                expiresIn: "15m",
                issuer: "meleti",
            }
        );

        return NextResponse.json({
            uid,
            name: userData.name,
            email: userData.email,
            accessToken,
        });
    } catch (err) {
        console.error("Refresh token error:", err);
        return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }
}
