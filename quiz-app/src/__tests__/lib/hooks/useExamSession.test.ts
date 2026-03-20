import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExamSession } from '@/lib/hooks/useExamSession';
import type { SharedQuestion } from '@/lib/types/exam';

const mockQuestions: SharedQuestion[] = [
  { id: 'q1', text: 'Question 1?', answers: ['A', 'B', 'C', 'D'], correctIndex: 0 },
  { id: 'q2', text: 'Question 2?', answers: ['A', 'B', 'C', 'D'], correctIndex: 1 },
  { id: 'q3', text: 'Question 3?', answers: ['A', 'B', 'C', 'D'], correctIndex: 2 },
];

describe('useExamSession', () => {
  it('should have session = null before start', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));
    expect(result.current.session).toBeNull();
    expect(result.current.score).toBe(0);
  });

  it('should start session keeping original question order', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    expect(result.current.session).not.toBeNull();
    expect(result.current.session!.questions).toEqual(mockQuestions);
    expect(result.current.session!.currentIndex).toBe(0);
    expect(result.current.session!.finished).toBe(false);
    expect(result.current.session!.selectedAnswers).toEqual([-1, -1, -1]);
  });

  it('should select an answer for the current question', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.selectAnswer(1);
    });

    expect(result.current.session!.selectedAnswers[0]).toBe(1);
  });

  it('should allow re-selecting answer (unlike practice mode)', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.selectAnswer(1);
    });

    act(() => {
      result.current.selectAnswer(2);
    });

    expect(result.current.session!.selectedAnswers[0]).toBe(2);
  });

  it('should navigate to specific question with goTo', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.goTo(2);
    });

    expect(result.current.session!.currentIndex).toBe(2);
  });

  it('should finish the session', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.finish();
    });

    expect(result.current.session!.finished).toBe(true);
  });

  it('should calculate score correctly', () => {
    const { result } = renderHook(() => useExamSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    // Answer q1 correctly (correctIndex: 0)
    act(() => {
      result.current.selectAnswer(0);
    });

    // Go to q2, answer correctly (correctIndex: 1)
    act(() => {
      result.current.goTo(1);
    });
    act(() => {
      result.current.selectAnswer(1);
    });

    // Go to q3, answer wrong
    act(() => {
      result.current.goTo(2);
    });
    act(() => {
      result.current.selectAnswer(0); // wrong, correct is 2
    });

    expect(result.current.score).toBe(2);
  });
});
