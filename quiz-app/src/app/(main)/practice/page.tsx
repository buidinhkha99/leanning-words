'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { usePracticeSession } from '@/lib/hooks/usePracticeSession';
import { addPracticeHistory } from '@/lib/services/history.service';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ResultScore } from '@/components/quiz/ResultScore';
import { ReviewItem } from '@/components/quiz/ReviewItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

export default function PracticePage() {
  const { user } = useAuth();
  const { questions, loading } = useQuestions();
  const mappedQuestions = questions.map((q) => ({
    id: q.id,
    text: q.text,
    answers: q.answers,
    correctIndex: q.correctIndex,
  }));
  const { session, start, selectAnswer, next, finish, reset, score } =
    usePracticeSession(mappedQuestions);

  const handleFinish = useCallback(async () => {
    if (!session || !user) return;
    finish();
    try {
      await addPracticeHistory(user.uid, {
        questions: session.questions,
        selectedAnswers: session.selectedAnswers,
        score: session.questions.reduce(
          (sum, q, i) => sum + (session.selectedAnswers[i] === q.correctIndex ? 1 : 0),
          0
        ),
        total: session.questions.length,
      });
    } catch {
      toast.error('Lưu lịch sử thất bại');
    }
  }, [session, user, finish]);

  if (loading) return <Skeleton className="h-64" />;

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
        message="Chưa có câu hỏi nào. Hãy thêm câu hỏi trước."
        action={
          <LinkButton href="/questions/add">Thêm câu hỏi</LinkButton>
        }
      />
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Ôn tập</h1>
        <p className="text-muted-foreground mb-6">
          {questions.length} câu hỏi trong ngân hàng. Bắt đầu ôn tập ngẫu nhiên.
        </p>
        <Button size="lg" onClick={start}>
          Bắt đầu ôn tập
        </Button>
      </div>
    );
  }

  if (session.finished) {
    return (
      <div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ResultScore score={score} total={session.questions.length} />
            <div className="flex gap-3 justify-center mt-6">
              <Button
                onClick={() => {
                  reset();
                  start();
                }}
              >
                Chơi tiếp
              </Button>
              <LinkButton href="/dashboard" variant="outline">Đóng</LinkButton>
            </div>
          </CardContent>
        </Card>
        <h3 className="text-lg font-semibold mb-3">Chi tiết</h3>
        {session.questions.map((q, i) => (
          <ReviewItem
            key={q.id}
            question={q}
            index={i}
            selectedAnswer={session.selectedAnswers[i]}
          />
        ))}
      </div>
    );
  }

  const currentQ = session.questions[session.currentIndex];
  const answered = session.selectedAnswers[session.currentIndex] !== -1;
  const isLast = session.currentIndex === session.questions.length - 1;

  return (
    <Card>
      <CardContent className="pt-6">
        <QuestionCard
          question={currentQ}
          index={session.currentIndex}
          total={session.questions.length}
          selectedAnswer={session.selectedAnswers[session.currentIndex]}
          showResult={answered}
          onSelect={selectAnswer}
        />
        {answered && (
          <Button
            className="w-full mt-4"
            onClick={isLast ? handleFinish : next}
          >
            {isLast ? 'Xem kết quả' : 'Tiếp tục'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
