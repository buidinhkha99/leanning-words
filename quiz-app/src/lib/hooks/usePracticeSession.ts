'use client';

import { useState, useCallback } from 'react';
import { SharedQuestion } from '../types/exam';
import { shuffleArray } from '../utils/helpers';
import { PRACTICE_QUESTION_COUNT } from '../utils/constants';

interface PracticeState {
  questions: SharedQuestion[];
  selectedAnswers: number[];
  currentIndex: number;
  finished: boolean;
}

export function usePracticeSession(allQuestions: SharedQuestion[]) {
  const [session, setSession] = useState<PracticeState | null>(null);

  const start = useCallback(() => {
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, Math.min(PRACTICE_QUESTION_COUNT, shuffled.length));
    setSession({
      questions: selected,
      selectedAnswers: new Array(selected.length).fill(-1),
      currentIndex: 0,
      finished: false,
    });
  }, [allQuestions]);

  const selectAnswer = useCallback((answerIndex: number) => {
    setSession((prev) => {
      if (!prev || prev.selectedAnswers[prev.currentIndex] !== -1) return prev;
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentIndex] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  }, []);

  const next = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const finish = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, finished: true };
    });
  }, []);

  const reset = useCallback(() => {
    setSession(null);
  }, []);

  const score = session
    ? session.questions.reduce(
        (sum, q, i) => sum + (session.selectedAnswers[i] === q.correctIndex ? 1 : 0),
        0
      )
    : 0;

  return { session, start, selectAnswer, next, finish, reset, score };
}
