'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Exam, ExamInput } from '../types/exam';
import * as examService from '../services/exam.service';

export function useExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await examService.getExams(user.uid);
      setExams(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (input: ExamInput) => {
    if (!user) return;
    await examService.addExam(user.uid, input);
    await refresh();
  };

  const update = async (id: string, input: Partial<ExamInput>) => {
    if (!user) return;
    await examService.updateExam(user.uid, id, input);
    await refresh();
  };

  const remove = async (id: string) => {
    if (!user) return;
    await examService.deleteExam(user.uid, id);
    await refresh();
  };

  return { exams, loading, add, update, remove, refresh };
}
