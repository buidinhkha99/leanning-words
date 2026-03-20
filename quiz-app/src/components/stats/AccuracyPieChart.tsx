'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, type PieLabelRenderProps } from 'recharts';

interface AccuracyPieChartProps {
  correct: number;
  wrong: number;
}

const COLORS = ['oklch(0.52 0.15 155)', 'oklch(0.55 0.22 25)'];

export function AccuracyPieChart({ correct, wrong }: AccuracyPieChartProps) {
  const data = [
    { name: 'Đúng', value: correct },
    { name: 'Sai', value: wrong },
  ];

  if (correct === 0 && wrong === 0) {
    return <p className="text-muted-foreground text-center py-8">Chưa có dữ liệu</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={(props: PieLabelRenderProps) => `${props.name || ''} ${(((props.percent as number) || 0) * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
