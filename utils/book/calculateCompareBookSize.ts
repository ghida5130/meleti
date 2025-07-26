type CalculateCompareBookSizeType = {
    w1: number;
    h1: number;
    d1: number | null;
    w2: number;
    h2: number;
    d2: number | null;
};

/**
 * 두 도서의 이미지 원본 크기를 기준 비율에 맞게 정규화하여 반환
 *
 * @param size 두 도서의 원본 사이즈 객체
 * @param size.w1 첫번째 도서 가로 (단위: cm)
 * @param size.h1 첫번째 도서 세로 (단위: cm)
 * @param size.d1 첫번째 도서 두께 (단위: cm)
 * @param size.w2 두번째 도서 가로 (단위: cm)
 * @param size.h2 두번째 도서 세로 (단위: cm)
 * @param size.d2 두번째 도서 두께 (단위: cm)
 * @returns [첫째가로, 첫째세로, 첫째두께, 둘째가로, 둘째세로, 둘째두께] (단위: cm)
 */
export function calculateCompareBookSize({ w1, h1, d1, w2, h2, d2 }: CalculateCompareBookSizeType): number[] {
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
