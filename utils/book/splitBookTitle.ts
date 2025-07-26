/**
 * 제목과 부제목을 분리하여 반환
 * @param title title
 * @param subtitle subtitle (선택사항). 없으면 title에서 추출
 * @returns [제목, 부제목]
 */
export function splitBookTitle(title: string, subtitle?: string): [string, string] {
    const dashIndex = title.indexOf("-");

    if (dashIndex === -1) {
        return [title.trim(), (subtitle ?? "").trim()];
    }

    const main = title.slice(0, dashIndex).trim();
    const subFromTitle = title.slice(dashIndex + 1).trim();

    return [main, (subtitle && subtitle.trim()) || subFromTitle];
}
