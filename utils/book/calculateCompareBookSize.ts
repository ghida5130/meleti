type CalculateCompareBookSizeType = {
    w1: number;
    h1: number;
    d1: number | null;
    w2: number;
    h2: number;
    d2: number | null;
};

// 이미지 원본 사이즈를 입력받아 최적 사이즈로 변환하여 반환
export function calculateCompareBookSize({ w1, h1, d1, w2, h2, d2 }: CalculateCompareBookSizeType) {
    // 최대 책 높이 지정
    const maxHeight = 5;

    // 책 사이즈 기본값 지정
    let [cw1, ch1, cd1] = [5, 3, 0.4];
    let [cw2, ch2, cd2] = [5, 3, 0.4];

    // 최대 높이 5에 맞추기 위해 곱해줄 값 (두 도서중 높이가 높은쪽을 기준)
    const largerHeight = h1 > h2 ? h1 : h2;
    const scaleFactor = maxHeight / largerHeight;

    // 사이즈 조정
    ch1 = h1 * scaleFactor;
    ch2 = h2 * scaleFactor;
    cw1 = w1 * scaleFactor;
    cw2 = w2 * scaleFactor;
    if (d1 !== null) cd1 = d1 * scaleFactor;
    if (d2 !== null) cd2 = d2 * scaleFactor;

    return [cw1, ch1, cd1, cw2, ch2, cd2];
}
