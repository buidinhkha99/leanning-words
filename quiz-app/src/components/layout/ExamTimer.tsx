'use client';

import { formatTime } from '@/lib/utils/helpers';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeLeft: number;
}

export function ExamTimer({ timeLeft }: ExamTimerProps) {
  const isDanger = timeLeft <= 60;

  return (
    <div
      className={`ml-auto flex items-center gap-1.5 text-lg font-bold tabular-nums ${
        isDanger ? 'text-red-300 animate-pulse-danger' : 'text-white'
      }`}
    >
      <Clock className="h-4 w-4" />
      {formatTime(timeLeft)}
    </div>
  );
}
