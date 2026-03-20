'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useExamSession } from '@/lib/hooks/useExamSession';
import { useTimer } from '@/lib/hooks/useTimer';
import * as examService from '@/lib/services/exam.service';
import * as questionService from '@/lib/services/question.service';
import { addExamHistory } from '@/lib/services/history.service';
import { Exam } from '@/lib/types/exam';
import { Question } from '@/lib/types/question';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuestionNav } from '@/components/quiz/QuestionNav';
import { ResultScore } from '@/components/quiz/ResultScore';
import { ReviewItem } from '@/components/quiz/ReviewItem';
import { ExamTimer } from '@/components/layout/ExamTimer';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExamSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [e, qs] = await Promise.all([
        examService.getExam(user!.uid, id),
        questionService.getQuestions(user!.uid),
      ]);
      setExam(e);
      if (e) {
        setQuestions(qs.filter((q) => e.questionIds.includes(q.id)));
      }
      setLoading(false);
    }
    load();
  }, [user, id]);

  const mappedQuestions = questions.map((q) => ({
    id: q.id,
    text: q.text,
    answers: q.answers,
    correctIndex: q.correctIndex,
  }));

  const { session, start, selectAnswer, goTo, finish, score } = useExamSession(mappedQuestions);

  const handleSubmit = useCallback(async () => {
    if (!session || !user || !exam || saved) return;
    finish();
    setSaved(true);
    try {
      await addExamHistory(user.uid, {
        examId: exam.id,
        examTitle: exam.title,
        questions: session.questions,
        selectedAnswers: session.selectedAnswers,
        score: session.questions.reduce(
          (sum, q, i) => sum + (session.selectedAnswers[i] === q.correctIndex ? 1 : 0),
          0
        ),
        total: session.questions.length,
        duration: exam.duration,
        timeTaken: elapsed,
      });
    } catch {
      toast.error('Lưu kết quả thất bại');
    }
  }, [session, user, exam, saved, finish]);

  const { timeLeft, elapsed, start: startTimer } = useTimer(
    exam?.duration || 30,
    handleSubmit
  );

  const handleStart = () => {
    start();
    startTimer();
    setStarted(true);
  };

  if (loading) return <Skeleton className="h-64" />;
  if (!exam) return <p className="text-muted-foreground">Không tìm thấy đề thi.</p>;

  // Not started yet - show info
  if (!started || !session) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
          {exam.description && (
            <p className="text-muted-foreground mb-4">{exam.description}</p>
          )}
          <div className="text-sm text-muted-foreground mb-6">
            {questions.length} câu hỏi &middot; {exam.duration} phút
          </div>
          <Button size="lg" onClick={handleStart}>
            Bắt đầu làm bài
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Finished - show result
  if (session.finished) {
    return (
      <div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ResultScore score={score} total={session.questions.length} />
            <div className="flex gap-3 justify-center mt-6">
              <LinkButton href="/exams" variant="outline">Về danh sách đề thi</LinkButton>
              <LinkButton href="/history" variant="outline">Xem lịch sử</LinkButton>
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

  // Active exam
  const currentQ = session.questions[session.currentIndex];

  return (
    <div>
      {/* Timer floating */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white">
        <div className="max-w-4xl mx-auto flex items-center h-14 px-4">
          <span className="font-bold">{exam.title}</span>
          <ExamTimer timeLeft={timeLeft} />
        </div>
      </div>

      <div className="pt-16">
        <QuestionNav
          total={session.questions.length}
          currentIndex={session.currentIndex}
          answeredIndices={session.selectedAnswers}
          onNavigate={goTo}
        />

        <Card>
          <CardContent className="pt-6">
            <QuestionCard
              question={currentQ}
              index={session.currentIndex}
              total={session.questions.length}
              selectedAnswer={session.selectedAnswers[session.currentIndex]}
              showResult={false}
              onSelect={selectAnswer}
            />

            <div className="flex gap-3 mt-4">
              {session.currentIndex > 0 && (
                <Button variant="outline" onClick={() => goTo(session.currentIndex - 1)}>
                  Trước
                </Button>
              )}
              {session.currentIndex < session.questions.length - 1 && (
                <Button onClick={() => goTo(session.currentIndex + 1)}>
                  Tiếp
                </Button>
              )}
              <Button
                variant="destructive"
                className="ml-auto"
                onClick={() => setConfirmSubmit(true)}
              >
                Nộp bài
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmSubmit}
        onOpenChange={setConfirmSubmit}
        title="Nộp bài"
        description={`Bạn đã trả lời ${session.selectedAnswers.filter((a) => a !== -1).length}/${session.questions.length} câu. Bạn có chắc muốn nộp bài?`}
        onConfirm={handleSubmit}
        variant="default"
      />
    </div>
  );
}
