import { QuestionInput } from '../types/question';

export function validateQuestion(q: Partial<QuestionInput>): string | null {
  if (!q.text?.trim()) return 'Vui lòng nhập nội dung câu hỏi';
  if (!q.answers || q.answers.length < 2) return 'Cần ít nhất 2 đáp án';
  if (q.answers.some(a => !a?.trim())) return 'Vui lòng điền đầy đủ đáp án';
  if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex >= q.answers.length) {
    return 'Vui lòng chọn đáp án đúng';
  }
  return null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
