export interface Exam {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  duration: number; // minutes
  shareCode?: string;
  createdAt: number;
  updatedAt: number;
}

export type ExamInput = Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>;

export interface SharedExam {
  shareCode: string;
  title: string;
  description: string;
  duration: number;
  questions: SharedQuestion[];
  ownerId: string;
  ownerName: string;
  createdAt: number;
  active: boolean;
}

export interface SharedQuestion {
  id: string;
  text: string;
  answers: string[];
  correctIndex: number;
}

export interface ExamAttempt {
  id: string;
  playerName: string;
  score: number;
  total: number;
  timeTaken: number; // seconds
  selectedAnswers: number[];
  createdAt: number;
}
