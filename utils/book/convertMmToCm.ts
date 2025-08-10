/**
 * mm 단위를 cm에 맞춰 마지막 숫자 앞에 소수점을 붙여서 반환
 *
 * @param str 변환할 숫자 (단위: mm)
 * @returns 변환된 숫자 (단위: cm)
 */
export function convertMmToCm(str: number | string): string {
    const s = String(str);
    if (s.length < 1) return s;
    if (s.length === 1) return `0.${s}`;
    return s.slice(0, -1) + "." + s.slice(-1);
}
