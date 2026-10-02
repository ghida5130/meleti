import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { checkOrigin } from "@/lib/auth/checkOrigin";
import { createSession, deleteSession, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
    const originError = checkOrigin(req);
    if (originError) return originError;

    try {
        const { idToken } = await req.json();
        if (typeof idToken !== "string" || !idToken) {
            return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
        }

        const decoded = await admin.auth().verifyIdToken(idToken, true);
        if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
            return NextResponse.json({ error: "다시 로그인해 주세요" }, { status: 401 });
        }

        const userRef = admin.firestore().collection("users").doc(decoded.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            await userRef.set({
                uid: decoded.uid,
                email: decoded.email ?? null,
                name: decoded.name ?? null,
                userImage: decoded.picture ?? null,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                role: "user",
            });
        }

        const user = userDoc.exists ? userDoc.data() ?? {} : {
            email: decoded.email ?? null,
            name: decoded.name ?? null,
            userImage: decoded.picture ?? null,
        };
        await deleteSession(req);
        const token = await createSession(decoded.uid);
        const response = NextResponse.json({
            uid: decoded.uid,
            email: user.email ?? null,
            name: user.name ?? null,
            userImage: user.userImage ?? null,
            isNewUser: !userDoc.exists,
        });
        setSessionCookie(response, token);
        return response;
    } catch (error) {
        console.error("로그인 실패:", error);
        return NextResponse.json({ error: "로그인에 실패했습니다" }, { status: 401 });
    }
}
