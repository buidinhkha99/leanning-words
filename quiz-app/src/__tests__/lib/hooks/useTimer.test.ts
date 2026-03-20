import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '@/lib/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with timeLeft = duration * 60 and running = false', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useTimer(5, onTimeUp));

    expect(result.current.timeLeft).toBe(300);
    expect(result.current.running).toBe(false);
    expect(result.current.elapsed).toBe(0);
  });

  it('should start counting down when start is called', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useTimer(1, onTimeUp));

    act(() => {
      result.current.start();
    });

    expect(result.current.running).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(57);
    expect(result.current.elapsed).toBe(3);
  });

  it('should stop counting when stop is called', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useTimer(1, onTimeUp));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.running).toBe(false);
    const timeAfterStop = result.current.timeLeft;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(timeAfterStop);
  });

  it('should call onTimeUp when time reaches 0', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useTimer(1, onTimeUp));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(onTimeUp).toHaveBeenCalledTimes(1);
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.running).toBe(false);
  });
});
