type NormalizeBookSizeType = {
    width: number | null;
    height: number | null;
    depth: number | null;
};

// 이미지 원본 사이즈를 입력받아 최적 사이즈로 변환하여 반환
export function normalizeBookSize({ width, height, depth }: NormalizeBookSizeType) {
    // 최대 책 높이 지정
    const maxHeight = 4.5;

    // 책 사이즈 기본값 지정
    let [cw1, ch1, cd1] = [3, 4.5, 0.4];

    // 사이즈 정보가 없을경우 기본값 사용
    if (width === null || height === null || depth === null) return [cw1, ch1, cd1];

    // 최대 높이 5에 맞추기 위해 곱해줄 값
    const scaleFactor = maxHeight / height;

    // 사이즈 조정
    cw1 = width * scaleFactor;
    ch1 = height * scaleFactor;
    cd1 = depth * scaleFactor;

    return [cw1, ch1, cd1];
}
