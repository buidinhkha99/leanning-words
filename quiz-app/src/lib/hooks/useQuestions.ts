'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Question, QuestionInput } from '../types/question';
import * as questionService from '../services/question.service';

export function useQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await questionService.getQuestions(user.uid);
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (input: QuestionInput) => {
    if (!user) return;
    await questionService.addQuestion(user.uid, input);
    await refresh();
  };

  const update = async (id: string, input: Partial<QuestionInput>) => {
    if (!user) return;
    await questionService.updateQuestion(user.uid, id, input);
    await refresh();
  };

  const remove = async (id: string) => {
    if (!user) return;
    await questionService.deleteQuestion(user.uid, id);
    await refresh();
  };

  const batchImport = async (inputs: QuestionInput[]) => {
    if (!user) return 0;
    const count = await questionService.batchImportQuestions(user.uid, inputs);
    await refresh();
    return count;
  };

  return { questions, loading, add, update, remove, batchImport, refresh };
}
