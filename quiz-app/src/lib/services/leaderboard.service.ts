import { addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { attemptsCol } from '../firebase/collections';
import { ExamAttempt } from '../types/exam';

export async function submitAttempt(
  shareCode: string,
  data: Omit<ExamAttempt, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(attemptsCol(shareCode), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function getLeaderboard(shareCode: string): Promise<ExamAttempt[]> {
  const q = query(attemptsCol(shareCode), orderBy('score', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExamAttempt);
}
