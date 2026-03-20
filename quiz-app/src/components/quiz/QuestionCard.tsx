'use client';

import { SharedQuestion } from '@/lib/types/exam';
import { LABELS } from '@/lib/utils/constants';
import { Progress } from '@/components/ui/progress';
import { OptionButton } from './OptionButton';

interface QuestionCardProps {
  question: SharedQuestion;
  index: number;
  total: number;
  selectedAnswer: number;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  showResult,
  onSelect,
}: QuestionCardProps) {
  const progress = (index / total) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-muted-foreground">
          Câu {index + 1} / {total}
        </span>
      </div>
      <Progress value={progress} className="mb-4 h-2" />
      <h3 className="text-lg font-semibold mb-4 leading-relaxed">{question.text}</h3>
      <div className="space-y-2.5">
        {question.answers.map((answer, i) => (
          <OptionButton
            key={i}
            label={LABELS[i]}
            text={answer}
            selected={selectedAnswer === i}
            correct={showResult && i === question.correctIndex}
            wrong={showResult && selectedAnswer === i && i !== question.correctIndex}
            disabled={showResult}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
