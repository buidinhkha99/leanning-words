import { SharedQuestion } from './exam';

export interface PracticeHistory {
  id: string;
  questions: SharedQuestion[];
  selectedAnswers: number[];
  score: number;
  total: number;
  createdAt: number;
}

export interface ExamHistory {
  id: string;
  examId: string;
  examTitle: string;
  questions: SharedQuestion[];
  selectedAnswers: number[];
  score: number;
  total: number;
  duration: number;
  timeTaken: number;
  createdAt: number;
}
