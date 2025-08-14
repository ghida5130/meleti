// app/api/user/profile-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { verifyAccessToken } from "@/lib/auth/verifyAccessToken";
import { randomUUID } from "crypto";

export const runtime = "nodejs"; // 파일 업로드는 node 런타임 권장
export const dynamic = "force-dynamic";

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        // accessToken 검증
        const result = verifyAccessToken(req);
        if ("uid" in result === false) return result;
        const { uid } = result;

        // req로 받은 파일 추출
        const form = await req.formData();
        const file = form.get("file");

        // file이 비었을경우 400 응답
        if (!(file instanceof File)) {
            return NextResponse.json({ error: "file 필드가 필요합니다" }, { status: 400 });
        }

        // ACCEPTED_TYPES에 있는 타입이 아닌경우 415 응답
        const mime = file.type || "application/octet-stream";
        if (!ACCEPTED_TYPES.has(mime)) {
            return NextResponse.json({ error: "허용되지 않은 파일 형식" }, { status: 415 });
        }

        // file 용량이 최대 한도를 초과했을경우 413 응답
        const size = file.size ?? 0;
        if (size <= 0 || size > IMAGE_MAX_SIZE) {
            return NextResponse.json({ error: "파일 용량 초과" }, { status: 413 });
        }

        const originalName = (file as File).name || "upload.bin";
        const timestamp = Date.now();
        const safeName = originalName.replace(/[^\w.\-]+/g, "_");
        const objectPath = `users/${uid}/profile/${timestamp}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3) Firebase Storage 업로드(관리자 권한)
        const bucket = admin.storage().bucket(); // 기본 버킷
        const gcsFile = bucket.file(objectPath);

        // 다운로드 토큰 생성(공유 URL 만들 때 사용)
        const token = randomUUID();

        await gcsFile.save(buffer, {
            contentType: mime,
            resumable: false,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: token,
                },
                cacheControl: "public, max-age=31536000",
            },
        });

        // 4) 다운로드 URL 구성
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
            objectPath
        )}?alt=media&token=${token}`;

        // 5) Firestore에 유저 프로필 이미지 URL 업데이트
        const db = admin.firestore();
        const userRef = db.collection("users").doc(uid);
        await userRef.set(
            {
                userImage: downloadURL,
                userImagePath: objectPath, // 나중에 교체/삭제할 때 유용
                userImageUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        return NextResponse.json({ success: true, url: downloadURL });
    } catch (error) {
        console.error("프로필 이미지 업로드 실패:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
