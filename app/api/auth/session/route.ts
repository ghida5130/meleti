import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";

export async function GET(req: Request) {
    const session = await verifySession(req);
    if (session instanceof Response) return session;
    return NextResponse.json(session, { headers: { "Cache-Control": "no-store" } });
}
