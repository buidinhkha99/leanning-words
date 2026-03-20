import { describe, it, expect } from 'vitest';
import { shuffleArray, formatTime, formatDate, scorePercent } from '@/lib/utils/helpers';

describe('shuffleArray', () => {
  it('should not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it('should return an array with the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toHaveLength(arr.length);
  });

  it('should contain all the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result.sort()).toEqual(arr.sort());
  });

  it('should handle empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('should handle single element', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('formatTime', () => {
  it('should format 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('should format 59 seconds as 00:59', () => {
    expect(formatTime(59)).toBe('00:59');
  });

  it('should format 60 seconds as 01:00', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('should format 125 seconds as 02:05', () => {
    expect(formatTime(125)).toBe('02:05');
  });

  it('should format large values', () => {
    expect(formatTime(3661)).toBe('61:01');
  });
});

describe('formatDate', () => {
  it('should format timestamp in vi-VN locale with day/month/year/hour/minute', () => {
    // Use a fixed timestamp: 2024-01-15T10:30:00 UTC
    const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
    const result = formatDate(timestamp);
    // Should contain date parts
    expect(result).toMatch(/15/);
    expect(result).toMatch(/01/);
    expect(result).toMatch(/2024/);
  });
});

describe('scorePercent', () => {
  it('should calculate 70% for 7/10', () => {
    expect(scorePercent(7, 10)).toBe(70);
  });

  it('should calculate 0% for 0/10', () => {
    expect(scorePercent(0, 10)).toBe(0);
  });

  it('should calculate 100% for 10/10', () => {
    expect(scorePercent(10, 10)).toBe(100);
  });

  it('should return 0 for 0/0', () => {
    expect(scorePercent(0, 0)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(scorePercent(1, 3)).toBe(33);
    expect(scorePercent(2, 3)).toBe(67);
  });
});
