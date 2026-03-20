import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { examsCol, examDoc, sharedExamDoc } from '../firebase/collections';
import { Exam, ExamInput, SharedExam } from '../types/exam';
import { Question } from '../types/question';

export async function getExams(userId: string): Promise<Exam[]> {
  const q = query(examsCol(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Exam);
}

export async function getExam(userId: string, examId: string): Promise<Exam | null> {
  const snap = await getDoc(examDoc(userId, examId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Exam) : null;
}

export async function addExam(userId: string, input: ExamInput): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(examsCol(userId), {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateExam(
  userId: string,
  examId: string,
  input: Partial<ExamInput>
): Promise<void> {
  await updateDoc(examDoc(userId, examId), {
    ...input,
    updatedAt: Date.now(),
  });
}

export async function deleteExam(userId: string, examId: string): Promise<void> {
  // Also check if shared and clean up
  const exam = await getExam(userId, examId);
  if (exam?.shareCode) {
    try {
      await deleteDoc(sharedExamDoc(exam.shareCode));
    } catch {
      // ignore if shared doc doesn't exist
    }
  }
  await deleteDoc(examDoc(userId, examId));
}

export async function shareExam(
  userId: string,
  examId: string,
  exam: Exam,
  questions: Question[],
  ownerName: string
): Promise<string> {
  const shareCode = exam.shareCode || nanoid(8);

  const sharedData: SharedExam = {
    shareCode,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    questions: questions
      .filter((q) => exam.questionIds.includes(q.id))
      .map((q) => ({
        id: q.id,
        text: q.text,
        answers: q.answers,
        correctIndex: q.correctIndex,
      })),
    ownerId: userId,
    ownerName,
    createdAt: Date.now(),
    active: true,
  };

  await setDoc(sharedExamDoc(shareCode), sharedData);

  if (!exam.shareCode) {
    await updateDoc(examDoc(userId, examId), { shareCode });
  }

  return shareCode;
}

export async function unshareExam(userId: string, examId: string, shareCode: string): Promise<void> {
  await deleteDoc(sharedExamDoc(shareCode));
  await updateDoc(examDoc(userId, examId), { shareCode: null });
}

export async function getSharedExam(shareCode: string): Promise<SharedExam | null> {
  const snap = await getDoc(sharedExamDoc(shareCode));
  return snap.exists() ? (snap.data() as SharedExam) : null;
}
