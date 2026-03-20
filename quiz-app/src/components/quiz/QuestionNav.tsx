'use client';

import { cn } from '@/lib/utils';

interface QuestionNavProps {
  total: number;
  currentIndex: number;
  answeredIndices: number[];
  onNavigate: (index: number) => void;
}

export function QuestionNav({ total, currentIndex, answeredIndices, onNavigate }: QuestionNavProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-5">
      {Array.from({ length: total }, (_, i) => {
        const answered = answeredIndices[i] !== -1;
        const current = i === currentIndex;
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={cn(
              'w-9 h-9 rounded-lg border-2 text-xs font-semibold transition-all',
              current && 'border-primary bg-primary/10 text-primary',
              answered && !current && 'bg-primary text-white border-primary',
              !current && !answered && 'border-border bg-card'
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
