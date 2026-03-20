'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { QuestionForm } from '@/components/quiz/QuestionForm';
import { validateQuestion } from '@/lib/utils/validators';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { questions, loading, update } = useQuestions();

  if (loading) return <Skeleton className="h-64" />;

  const question = questions.find((q) => q.id === id);
  if (!question) {
    return <p className="text-muted-foreground">Không tìm thấy câu hỏi.</p>;
  }

  return (
    <QuestionForm
      initialData={{
        text: question.text,
        answers: question.answers,
        correctIndex: question.correctIndex,
      }}
      submitLabel="Cập nhật"
      onCancel={() => router.push('/questions')}
      onSubmit={async (data) => {
        const error = validateQuestion(data);
        if (error) {
          toast.error(error);
          return;
        }
        await update(id, data);
        toast.success('Đã cập nhật câu hỏi');
        router.push('/questions');
      }}
    />
  );
}
