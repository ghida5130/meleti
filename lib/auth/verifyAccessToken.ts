// lib/auth/verifyToken.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

interface TokenPayload {
    uid: string;
    email?: string;
    role?: string;
}

export function verifyAccessToken(req: Request): { uid: string } | Response {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "No access token provided" }, { status: 401 });
    }

    const accessToken = authHeader.split(" ")[1];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessSecret) {
        console.error("ACCESS_TOKEN_SECRET is not set");
        return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(accessToken, accessSecret) as TokenPayload;

        if (!decoded?.uid) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        return { uid: decoded.uid };
    } catch {
        return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
    }
}
