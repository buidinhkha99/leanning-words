import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { questionsCol, questionDoc } from '../firebase/collections';
import { db } from '../firebase/config';
import { Question, QuestionInput } from '../types/question';
import { FIRESTORE_BATCH_LIMIT } from '../utils/constants';

export async function getQuestions(userId: string): Promise<Question[]> {
  const q = query(questionsCol(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Question);
}

export async function addQuestion(userId: string, input: QuestionInput): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(questionsCol(userId), {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateQuestion(
  userId: string,
  questionId: string,
  input: Partial<QuestionInput>
): Promise<void> {
  await updateDoc(questionDoc(userId, questionId), {
    ...input,
    updatedAt: Date.now(),
  });
}

export async function deleteQuestion(userId: string, questionId: string): Promise<void> {
  await deleteDoc(questionDoc(userId, questionId));
}

export async function batchImportQuestions(
  userId: string,
  inputs: QuestionInput[]
): Promise<number> {
  let count = 0;
  const col = questionsCol(userId);
  for (let i = 0; i < inputs.length; i += FIRESTORE_BATCH_LIMIT) {
    const batch = writeBatch(db);
    const chunk = inputs.slice(i, i + FIRESTORE_BATCH_LIMIT);
    const now = Date.now();
    for (const input of chunk) {
      const ref = doc(col);
      batch.set(ref, {
        ...input,
        createdAt: now,
        updatedAt: now,
      });
      count++;
    }
    await batch.commit();
  }
  return count;
}
