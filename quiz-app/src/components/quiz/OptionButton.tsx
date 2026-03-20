'use client';

import { cn } from '@/lib/utils';

interface OptionButtonProps {
  label: string;
  text: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function OptionButton({
  label,
  text,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      className={cn(
        'w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all flex items-start gap-3',
        'hover:border-primary hover:bg-primary/5',
        selected && !correct && !wrong && 'border-primary bg-primary/10',
        correct && 'border-green-600 bg-green-50 text-green-800 font-semibold',
        wrong && 'border-red-600 bg-red-50 text-red-800 font-semibold',
        disabled && 'pointer-events-none opacity-90',
        !selected && !correct && !wrong && 'border-border bg-card'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
          correct
            ? 'bg-green-600 text-white'
            : wrong
              ? 'bg-red-600 text-white'
              : 'bg-muted text-muted-foreground'
        )}
      >
        {label}
      </span>
      <span className="leading-relaxed pt-0.5">{text}</span>
    </button>
  );
}
