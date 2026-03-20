import { collection, doc } from 'firebase/firestore';
import { db } from './config';

export function userDoc(userId: string) {
  return doc(db, 'users', userId);
}

export function questionsCol(userId: string) {
  return collection(db, 'users', userId, 'questions');
}

export function questionDoc(userId: string, qId: string) {
  return doc(db, 'users', userId, 'questions', qId);
}

export function examsCol(userId: string) {
  return collection(db, 'users', userId, 'exams');
}

export function examDoc(userId: string, examId: string) {
  return doc(db, 'users', userId, 'exams', examId);
}

export function practiceHistoryCol(userId: string) {
  return collection(db, 'users', userId, 'practiceHistory');
}

export function examHistoryCol(userId: string) {
  return collection(db, 'users', userId, 'examHistory');
}

export function sharedExamDoc(shareCode: string) {
  return doc(db, 'sharedExams', shareCode);
}

export function sharedExamsCol() {
  return collection(db, 'sharedExams');
}

export function attemptsCol(shareCode: string) {
  return collection(db, 'sharedExams', shareCode, 'attempts');
}
