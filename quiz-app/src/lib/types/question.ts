export interface Question {
  id: string;
  text: string;
  answers: string[];
  correctIndex: number;
  createdAt: number;
  updatedAt: number;
}

export type QuestionInput = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>;
