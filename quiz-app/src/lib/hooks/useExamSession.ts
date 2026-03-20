'use client';

import { useState, useCallback } from 'react';
import { SharedQuestion } from '../types/exam';

interface ExamState {
  questions: SharedQuestion[];
  selectedAnswers: number[];
  currentIndex: number;
  finished: boolean;
}

export function useExamSession(questions: SharedQuestion[]) {
  const [session, setSession] = useState<ExamState | null>(null);

  const start = useCallback(() => {
    setSession({
      questions,
      selectedAnswers: new Array(questions.length).fill(-1),
      currentIndex: 0,
      finished: false,
    });
  }, [questions]);

  const selectAnswer = useCallback((answerIndex: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentIndex] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, currentIndex: index };
    });
  }, []);

  const finish = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, finished: true };
    });
  }, []);

  const score = session
    ? session.questions.reduce(
        (sum, q, i) => sum + (session.selectedAnswers[i] === q.correctIndex ? 1 : 0),
        0
      )
    : 0;

  return { session, start, selectAnswer, goTo, finish, score };
}
