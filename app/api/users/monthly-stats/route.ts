import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifyAccessToken } from "@/lib/auth/verifyAccessToken";

// 사용자 컬렉션 monthly-stats에 월별 독서량 count 수정
// req: accessToken
// res: 월별 독서량 수정 성공 여부
export async function POST(req: NextRequest) {
    try {
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        const { count, pages, finishedAt } = await req.json();

        const db = admin.firestore();
        const monthlyStatsRef = db.collection("users").doc(uid).collection("monthlyStats").doc(finishedAt);

        const docSnap = await monthlyStatsRef.get();

        if (docSnap.exists) {
            await monthlyStatsRef.update({
                count: admin.firestore.FieldValue.increment(count),
                readPages: admin.firestore.FieldValue.increment(pages),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            await monthlyStatsRef.set({
                count,
                readPages: pages,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        return NextResponse.json({ message: "서버 월별 독서량 업데이트 완료", success: true });
    } catch (error) {
        console.error("사용자 월별 독서량 업데이트 실패 : ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        const year = req.nextUrl.searchParams.get("year");

        if (!year) {
            return NextResponse.json({ error: "연도 정보 없음" }, { status: 400 });
        }

        const db = admin.firestore();
        const monthlyStatsRef = db.collection("users").doc(uid).collection("monthlyStats");

        const snapshot = await monthlyStatsRef.get();

        const monthlyStatsData = snapshot.docs
            .map((doc) => {
                const id = doc.id;
                const data = doc.data();
                if (!id.startsWith(year.slice(2))) return null;
                return { month: id, count: data.count ?? 0 };
            })
            .filter(Boolean)
            .sort((a, b) => a!.month.localeCompare(b!.month));

        return NextResponse.json({ data: monthlyStatsData });
    } catch (error) {
        console.error("사용자 월별 독서량 조회 실패 :", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
