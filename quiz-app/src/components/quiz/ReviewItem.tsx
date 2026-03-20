'use client';

import { SharedQuestion } from '@/lib/types/exam';
import { LABELS } from '@/lib/utils/constants';

interface ReviewItemProps {
  question: SharedQuestion;
  index: number;
  selectedAnswer: number;
}

export function ReviewItem({ question, index, selectedAnswer }: ReviewItemProps) {
  const correct = selectedAnswer === question.correctIndex;
  const notAnswered = selectedAnswer === -1;

  return (
    <div
      className={`p-4 rounded-lg border-l-4 mb-3 ${
        correct
          ? 'border-l-green-600 bg-green-50'
          : 'border-l-red-600 bg-red-50'
      }`}
    >
      <div className="font-semibold mb-2">
        Câu {index + 1}: {question.text}
      </div>
      {notAnswered ? (
        <>
          <div className="text-sm text-muted-foreground italic">Chưa trả lời</div>
          <div className="text-sm text-green-700 font-medium">
            Đáp án đúng: {LABELS[question.correctIndex]}. {question.answers[question.correctIndex]}
          </div>
        </>
      ) : !correct ? (
        <>
          <div className="text-sm text-red-700">
            Bạn chọn: {LABELS[selectedAnswer]}. {question.answers[selectedAnswer]}
          </div>
          <div className="text-sm text-green-700 font-medium">
            Đáp án đúng: {LABELS[question.correctIndex]}. {question.answers[question.correctIndex]}
          </div>
        </>
      ) : (
        <div className="text-sm text-green-700 font-medium">
          Bạn chọn đúng: {LABELS[selectedAnswer]}. {question.answers[selectedAnswer]}
        </div>
      )}
    </div>
  );
}
