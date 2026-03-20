'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { QuestionForm } from '@/components/quiz/QuestionForm';
import { validateQuestion } from '@/lib/utils/validators';

export default function AddQuestionPage() {
  const router = useRouter();
  const { add } = useQuestions();

  return (
    <QuestionForm
      submitLabel="Thêm câu hỏi"
      onCancel={() => router.push('/questions')}
      onSubmit={async (data) => {
        const error = validateQuestion(data);
        if (error) {
          toast.error(error);
          return;
        }
        await add(data);
        toast.success('Đã thêm câu hỏi');
        router.push('/questions');
      }}
    />
  );
}
