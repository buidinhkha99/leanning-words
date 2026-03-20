import { describe, it, expect } from 'vitest';
import { validateQuestion, validateEmail } from '@/lib/utils/validators';

describe('validateQuestion', () => {
  const validQuestion = {
    text: 'What is 1+1?',
    answers: ['1', '2', '3', '4'],
    correctIndex: 1,
  };

  it('should return null for a valid question', () => {
    expect(validateQuestion(validQuestion)).toBeNull();
  });

  it('should return error for empty text', () => {
    expect(validateQuestion({ ...validQuestion, text: '' })).toBe(
      'Vui lòng nhập nội dung câu hỏi'
    );
  });

  it('should return error for whitespace-only text', () => {
    expect(validateQuestion({ ...validQuestion, text: '   ' })).toBe(
      'Vui lòng nhập nội dung câu hỏi'
    );
  });

  it('should return error for missing text', () => {
    expect(validateQuestion({ answers: ['a', 'b'], correctIndex: 0 })).toBe(
      'Vui lòng nhập nội dung câu hỏi'
    );
  });

  it('should return error for fewer than 2 answers', () => {
    expect(validateQuestion({ ...validQuestion, answers: ['only one'] })).toBe(
      'Cần ít nhất 2 đáp án'
    );
  });

  it('should return error for empty answers array', () => {
    expect(validateQuestion({ ...validQuestion, answers: [] })).toBe(
      'Cần ít nhất 2 đáp án'
    );
  });

  it('should return error for blank answer in array', () => {
    expect(
      validateQuestion({ ...validQuestion, answers: ['a', ''] })
    ).toBe('Vui lòng điền đầy đủ đáp án');
  });

  it('should return error for correctIndex out of range (negative)', () => {
    expect(
      validateQuestion({ ...validQuestion, correctIndex: -1 })
    ).toBe('Vui lòng chọn đáp án đúng');
  });

  it('should return error for correctIndex >= answers.length', () => {
    expect(
      validateQuestion({ ...validQuestion, correctIndex: 4 })
    ).toBe('Vui lòng chọn đáp án đúng');
  });

  it('should return error for undefined correctIndex', () => {
    expect(
      validateQuestion({ text: 'Q?', answers: ['a', 'b'] })
    ).toBe('Vui lòng chọn đáp án đúng');
  });
});

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should return true for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should return false for no domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('should return false for no local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('should return false for no @ sign', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('should return false for spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });
});
