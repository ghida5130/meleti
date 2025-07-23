// 입력 : title:string, subtitle:string
// 출력 : [title:string, subtitle:string]

// title에서 subtitle을 분리하여 title만을 반환하고 subtitle이 없을경우 title에서 분리한 subtitle을 반환
export function splitBookTitle(title: string, subtitle?: string): [string, string] {
    const dashIndex = title.indexOf("-");

    if (dashIndex === -1) {
        return [title.trim(), (subtitle ?? "").trim()];
    }

    const main = title.slice(0, dashIndex).trim();
    const subFromTitle = title.slice(dashIndex + 1).trim();

    return [main, (subtitle && subtitle.trim()) || subFromTitle];
}
