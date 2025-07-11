// ISO 8601 형식의 날짜데이터를 yy MM 형식으로 변환
export function dateToYearMonth(dateStr: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}.${month}`;
}
