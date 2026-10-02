import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";

export const SESSION_COOKIE = "meletiSession";
export const DEMO_SESSION = "demo";
const SESSION_AGE_SECONDS = 7 * 24 * 60 * 60;

export type SessionUser = {
    uid: string;
    name: string | null;
    email: string | null;
    userImage: string | null;
    isDemo: boolean;
};

function sessionId(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

function readCookie(req: Request): string | null {
    const cookie = req.headers.get("cookie") ?? "";
    const value = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
    return value ? value.slice(SESSION_COOKIE.length + 1) : null;
}

export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_AGE_SECONDS,
    });
    response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
}

export function clearSessionCookie(response: NextResponse) {
    response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });
    response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
}

export async function createSession(uid: string): Promise<string> {
    const token = randomBytes(32).toString("base64url");
    await admin.firestore().collection("sessions").doc(sessionId(token)).set({
        uid,
        expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + SESSION_AGE_SECONDS * 1000),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return token;
}

export async function deleteSession(req: Request) {
    const token = readCookie(req);
    if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) {
        await admin.firestore().collection("sessions").doc(sessionId(token)).delete();
    }
}

export async function verifySession(req: Request, write = false): Promise<SessionUser | Response> {
    const token = readCookie(req);
    if (!token) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    if (token === DEMO_SESSION) {
        if (write) return NextResponse.json({ error: "데모 계정은 기록을 변경할 수 없습니다" }, { status: 403 });
        return { uid: "demo_user", name: "Demo User", email: "demo@example.com", userImage: null, isDemo: true };
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
        const response = NextResponse.json({ error: "세션이 올바르지 않습니다" }, { status: 401 });
        clearSessionCookie(response);
        return response;
    }

    try {
        const sessionDoc = await admin.firestore().collection("sessions").doc(sessionId(token)).get();
        const session = sessionDoc.data();
        if (!sessionDoc.exists || !session || typeof session.uid !== "string" ||
            typeof session.expiresAt?.toMillis !== "function" || session.expiresAt.toMillis() <= Date.now()) {
            const response = NextResponse.json({ error: "세션이 만료되었습니다" }, { status: 401 });
            clearSessionCookie(response);
            return response;
        }
        const userDoc = await admin.firestore().collection("users").doc(session.uid).get();
        if (!userDoc.exists) {
            const response = NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 401 });
            clearSessionCookie(response);
            return response;
        }
        const user = userDoc.data() ?? {};
        return {
            uid: session.uid,
            name: typeof user.name === "string" ? user.name : null,
            email: typeof user.email === "string" ? user.email : null,
            userImage: typeof user.userImage === "string" ? user.userImage : null,
            isDemo: false,
        };
    } catch (error) {
        console.error("세션 조회 실패:", error);
        return NextResponse.json({ error: "세션 조회에 실패했습니다" }, { status: 500 });
    }
}
