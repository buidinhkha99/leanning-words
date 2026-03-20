'use client';

import { scorePercent } from '@/lib/utils/helpers';

interface ResultScoreProps {
  score: number;
  total: number;
}

export function ResultScore({ score, total }: ResultScoreProps) {
  const pct = scorePercent(score, total);
  const isGood = pct >= 50;

  return (
    <div
      className={`text-center py-8 rounded-xl ${
        isGood ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}
    >
      <div className="text-5xl font-bold">
        {score}/{total}
      </div>
      <div className="text-xl mt-2 font-medium">{pct}% đúng</div>
    </div>
  );
}
