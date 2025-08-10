"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./profileImageEditPage.module.scss";
import Image from "next/image";

const API_ENDPOINT = "/api/profile/image"; // 변경해서 사용

export default function ProfileImageEditPage() {
    const inputId = useId();
    const hintId = useId();
    const errorId = useId();
    const statusId = useId();

    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const onSelectFile = (file?: File) => {
        setError(null);
        setStatus("");
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("이미지 파일만 업로드 해주세요.");
            return;
        }
        const MAX = 5 * 1024 * 1024;
        if (file.size > MAX) {
            setError("5MB 이하의 파일만 업로드 해주세요.");
            return;
        }
        setImage(file);
        setStatus(`선택된 파일: ${file.name}`);
    };

    const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        onSelectFile(file);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!image) return;
        setIsUploading(true);
        setError(null);
        setStatus("업로드 중…");
        try {
            const formData = new FormData();
            formData.set("file", image);
            const res = await fetch(API_ENDPOINT, { method: "POST", body: formData });
            if (!res.ok) {
                const msg = await res.text().catch(() => "업로드 실패");
                throw new Error(msg || "업로드 실패");
            }
            setImage(null);
            setPreviewUrl(null);
            setStatus("프로필 이미지 수정 완료");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "업로드 중 오류 발생";
            setError(msg);
            setStatus("");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className={styles.header}>
                <h1 style={{ fontSize: "25px", fontWeight: "800" }}>프로필 이미지 수정</h1>
            </div>
            <form className={styles.formWrap} onSubmit={handleSubmit} noValidate>
                {/* 상태 라이브 영역(스크린리더에게만 보임) */}
                <p id={statusId} className="sr-only" aria-live="polite">
                    {status}
                </p>
                <label
                    htmlFor={inputId}
                    className={[
                        styles.dropzone,
                        isDragging ? styles.dragging : "",
                        previewUrl ? styles.filled : "",
                    ].join(" ")}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isDragging) setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    data-dragging={isDragging ? "true" : "false"}
                    aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
                    aria-label="프로필 이미지 업로드 영역"
                >
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt={image ? `${image.name} 미리보기` : "업로드한 이미지 미리보기"}
                            className={styles.preview}
                            width={292}
                            height={292}
                            style={{ objectFit: "cover" }}
                            unoptimized
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <span className={styles.placeholderIcon} aria-hidden="true">
                                🖼️
                            </span>
                            <p className={styles.placeholderText}>이미지를 드래그앤드롭하거나 클릭하여 업로드</p>
                            <p id={hintId} className={styles.hint}>
                                PNG, JPG · 최대 5MB
                            </p>
                        </div>
                    )}
                </label>

                <input
                    ref={inputRef}
                    id={inputId}
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onSelectFile(e.target.files?.[0] ?? undefined)}
                    aria-invalid={error ? true : false}
                    aria-errormessage={error ? errorId : undefined}
                />

                <div className={styles.row}>
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => {
                            setImage(null);
                            setPreviewUrl(null);
                            setError(null);
                            setStatus("이미지가 초기화 되었습니다.");
                        }}
                        disabled={isUploading || (!image && !previewUrl)}
                    >
                        초기화
                    </button>

                    <button
                        className={styles.primaryBtn}
                        type="submit"
                        disabled={!image || isUploading}
                        aria-disabled={!image || isUploading}
                    >
                        {isUploading ? "업로드 중..." : "수정 하기"}
                    </button>
                </div>

                {/* 파일 선택 대안 버튼(키보드 사용자를 위해 명시적으로 제공) */}
                <div className={`${styles.inlineActions} sr-only`}>
                    <button type="button" className={styles.linkBtn} onClick={() => inputRef.current?.click()}>
                        파일 선택하기
                    </button>
                </div>

                {error && (
                    <p id={errorId} className={styles.error} role="alert">
                        {error}
                    </p>
                )}
            </form>
        </>
    );
}
