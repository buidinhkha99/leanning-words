import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePracticeSession } from '@/lib/hooks/usePracticeSession';
import type { SharedQuestion } from '@/lib/types/exam';

const mockQuestions: SharedQuestion[] = Array.from({ length: 5 }, (_, i) => ({
  id: `q${i + 1}`,
  text: `Question ${i + 1}?`,
  answers: ['A', 'B', 'C', 'D'],
  correctIndex: i % 4,
}));

describe('usePracticeSession', () => {
  it('should have session = null before start', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));
    expect(result.current.session).toBeNull();
    expect(result.current.score).toBe(0);
  });

  it('should create a session with shuffled questions on start', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    expect(result.current.session).not.toBeNull();
    expect(result.current.session!.questions).toHaveLength(5);
    expect(result.current.session!.currentIndex).toBe(0);
    expect(result.current.session!.finished).toBe(false);
    expect(result.current.session!.selectedAnswers).toEqual([-1, -1, -1, -1, -1]);
  });

  it('should select an answer for the current question', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.selectAnswer(2);
    });

    expect(result.current.session!.selectedAnswers[0]).toBe(2);
  });

  it('should not allow re-selecting answer for the same question', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.selectAnswer(2);
    });

    act(() => {
      result.current.selectAnswer(3);
    });

    // Still 2, not changed to 3
    expect(result.current.session!.selectedAnswers[0]).toBe(2);
  });

  it('should advance to next question', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.session!.currentIndex).toBe(1);
  });

  it('should finish the session', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.finish();
    });

    expect(result.current.session!.finished).toBe(true);
  });

  it('should reset the session to null', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.session).toBeNull();
  });

  it('should calculate score correctly', () => {
    const { result } = renderHook(() => usePracticeSession(mockQuestions));

    act(() => {
      result.current.start();
    });

    const questions = result.current.session!.questions;

    // Answer all questions correctly
    for (let i = 0; i < questions.length; i++) {
      act(() => {
        result.current.selectAnswer(questions[i].correctIndex);
      });
      if (i < questions.length - 1) {
        act(() => {
          result.current.next();
        });
      }
    }

    expect(result.current.score).toBe(questions.length);
  });
});
