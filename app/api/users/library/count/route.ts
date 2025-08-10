import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifyAccessToken } from "@/lib/auth/verifyAccessToken";

export const dynamic = "force-dynamic";

export type CountByStatusType = {
    finished: number;
    wish: number;
    reading: number;
};

// 사용자 서재 카테고리별 개수 반환
// req: accessToken
// res: 사용자 서재 카테고리별 개수
export async function GET(req: NextRequest) {
    try {
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        const db = admin.firestore();
        const libraryRef = db.collection("users").doc(uid).collection("library");
        const snapshot = await libraryRef.get();

        // 초기값
        const countByStatus: CountByStatusType = {
            finished: 0,
            wish: 0,
            reading: 0,
        };

        snapshot.forEach((doc) => {
            const status = doc.data().status;
            if (status === "읽은 책") countByStatus.finished += 1;
            else if (status === "읽고 싶은 책") countByStatus.wish += 1;
            else if (status === "읽는 중인 책") countByStatus.reading += 1;
        });

        return NextResponse.json<CountByStatusType>(countByStatus);
    } catch (error) {
        console.error("서재 카테고리별 개수 불러오기 실패 : ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
