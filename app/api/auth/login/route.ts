import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// 로그인
// req: firebase idToken
// res: 사용자 기본 정보, accessToken, refreshToken
export async function POST(req: Request) {
    try {
        const { idToken } = await req.json();

        // 토큰 정보가 없을경우 error 처리
        if (!idToken) {
            return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
        }

        // firebase id token 유효성 검증
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const uid = decodedToken.uid;
        const email = decodedToken.email;
        const name = decodedToken.name;

        // firebase admin, firestore를 통해 회원 조회
        // 회원 정보가 없을경우 자동 가입 처리
        const db = admin.firestore();
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                uid,
                email,
                name,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                role: "user",
            });
            console.log(`신규 회원 가입: ${email} ${uid}`);
        } else {
            console.log(`기존 회원 로그인: ${email} ${uid}`);
        }

        // access, refresh token 생성
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret || !refreshSecret) throw new Error("Token secret is not set");

        const accessToken = jwt.sign(
            { uid, email, role: userDoc.exists ? userDoc.data()?.role : "user" },
            accessSecret,
            { expiresIn: "15m", issuer: "meleti" }
        );

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
            isNewUser: !userDoc.exists,
            role: userDoc.exists ? userDoc.data()?.role : "user",
            accessToken,
        });

        response.headers.set("Set-Cookie", refreshCookie);

        return response;
    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}
