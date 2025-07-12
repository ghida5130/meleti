"use client";

import { useSecureGetQuery } from "@/hooks/useSecureGetQuery";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart, CartesianGrid } from "recharts";

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

    const chartData = fillMissingMonths(data.data);
    const maxCount = Math.max(...chartData.map((d) => d.count));
    const rawTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);
    const yTicks = rawTicks.filter((v) => v !== 0); // 0 제외

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ right: 50, bottom: 20, top: 20 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="month" interval={0} tick={{ fontSize: 15, dy: 4 }} tickLine={false} />
                <YAxis ticks={yTicks} tick={{ fontSize: 15, dx: -2 }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8db3fe" />
            </BarChart>
        </ResponsiveContainer>
    );
}
