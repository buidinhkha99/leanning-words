import { addDoc, getDocs, getDoc, query, orderBy, doc } from 'firebase/firestore';
import { practiceHistoryCol, examHistoryCol } from '../firebase/collections';
import { PracticeHistory, ExamHistory } from '../types/history';

export async function addPracticeHistory(
  userId: string,
  data: Omit<PracticeHistory, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(practiceHistoryCol(userId), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function addExamHistory(
  userId: string,
  data: Omit<ExamHistory, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(examHistoryCol(userId), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function getPracticeHistory(userId: string): Promise<PracticeHistory[]> {
  const q = query(practiceHistoryCol(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PracticeHistory);
}

export async function getExamHistory(userId: string): Promise<ExamHistory[]> {
  const q = query(examHistoryCol(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExamHistory);
}

export async function getPracticeHistoryItem(
  userId: string,
  id: string
): Promise<PracticeHistory | null> {
  const snap = await getDoc(doc(practiceHistoryCol(userId), id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as PracticeHistory) : null;
}

export async function getExamHistoryItem(
  userId: string,
  id: string
): Promise<ExamHistory | null> {
  const snap = await getDoc(doc(examHistoryCol(userId), id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as ExamHistory) : null;
}
