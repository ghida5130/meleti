"use client";

import { useSecureGetQuery } from "@/hooks/useSecureGetQuery";
import { XAxis, YAxis, ResponsiveContainer, Bar, BarChart, CartesianGrid, Cell } from "recharts";

function fillMissingMonths(data: { month: string; count: number }[]) {
    const filled: { month: string; count: number }[] = [];

    for (let i = 1; i <= 12; i++) {
        const key = `24.${String(i).padStart(2, "0")}`; // 예: "24.01"
        const label = `${i}월`; // 예: "1월"
        const found = data.find((d) => d.month === key);
        filled.push({ month: label, count: found?.count ?? 0 });
    }

    return filled;
}

export default function UserMonthlyStatsChart() {
    const { data, isLoading, error } = useSecureGetQuery<{
        data: { month: string; count: number }[];
    }>("/api/users/monthly-stats?year=2024");

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error.message}</div>;
    if (!data) return <div>데이터 없음</div>;
    const colors = ["#aab5c7", "#cac6d1", "#cfc7bd"];

    const chartData = fillMissingMonths(data.data).map((item, index) => ({
        ...item,
        fill: colors[index % colors.length],
    }));
    const maxCount = Math.max(...chartData.map((d) => d.count));
    const rawTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);
    const yTicks = rawTicks.filter((v) => v !== 0);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ right: 35, bottom: 20, top: 20 }} barCategoryGap={2}>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" strokeOpacity={0.6} vertical={false} />
                <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
                <XAxis dataKey="month" interval={1} tick={{ fontSize: 14, dy: 4 }} tickLine={false} />
                <YAxis width={45} ticks={yTicks} tick={{ fontSize: 15, dx: -2 }} tickLine={false} />
            </BarChart>
        </ResponsiveContainer>
    );
}
