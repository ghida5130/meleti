type NormalizeBookSizeType = {
    width: number | null;
    height: number | null;
    depth: number | null;
};

/**
 * 도서 원본 크기를 기준 비율에 맞게 정규화하여 반환
 *
 * @param size 변환할 책의 원본 사이즈 객체
 * @param size.width 가로 길이 (단위: cm), 없으면 기본값 사용
 * @param size.height 세로 길이 (단위: cm), 없으면 기본값 사용
 * @param size.depth 두께 (단위: cm), 없으면 기본값 사용
 * @returns [가로, 세로, 두께] (단위: cm)
 */
export function normalizeBookSize({ width, height, depth }: NormalizeBookSizeType): [number, number, number] {
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
