'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  data: { date: string; score: number }[];
}

export function ScoreChart({ data }: ScoreChartProps) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Chưa có dữ liệu</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis domain={[0, 100]} fontSize={12} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="oklch(0.48 0.18 260)"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Điểm (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
