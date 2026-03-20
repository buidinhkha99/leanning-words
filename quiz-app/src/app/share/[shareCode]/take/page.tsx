'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { toast } from 'sonner';
import { getSharedExam } from '@/lib/services/exam.service';
import { submitAttempt } from '@/lib/services/leaderboard.service';
import { useExamSession } from '@/lib/hooks/useExamSession';
import { useTimer } from '@/lib/hooks/useTimer';
import { SharedExam } from '@/lib/types/exam';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuestionNav } from '@/components/quiz/QuestionNav';
import { ResultScore } from '@/components/quiz/ResultScore';
import { ReviewItem } from '@/components/quiz/ReviewItem';
import { ExamTimer } from '@/components/layout/ExamTimer';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function SharedExamPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = use(params);
  const [exam, setExam] = useState<SharedExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [started, setStarted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSharedExam(shareCode).then((e) => {
      setExam(e);
      setLoading(false);
    });
  }, [shareCode]);

  const { session, start, selectAnswer, goTo, finish, score } = useExamSession(
    exam?.questions || []
  );

  const handleSubmit = useCallback(async () => {
    if (!session || !exam || saved) return;
    finish();
    setSaved(true);
    const s = session.questions.reduce(
      (sum, q, i) => sum + (session.selectedAnswers[i] === q.correctIndex ? 1 : 0),
      0
    );
    try {
      await submitAttempt(shareCode, {
        playerName: playerName || 'Khách',
        score: s,
        total: session.questions.length,
        timeTaken: elapsed,
        selectedAnswers: session.selectedAnswers,
      });
    } catch {
      toast.error('Lưu kết quả thất bại');
    }
  }, [session, exam, saved, playerName, shareCode, finish]);

  const { timeLeft, elapsed, start: startTimer } = useTimer(
    exam?.duration || 30,
    handleSubmit
  );

  const handleStart = () => {
    if (!playerName.trim()) {
      toast.error('Vui lòng nhập tên');
      return;
    }
    start();
    startTimer();
    setStarted(true);
  };

  if (loading) return <div className="max-w-4xl mx-auto p-4"><Skeleton className="h-64" /></div>;
  if (!exam || !exam.active) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Đề thi không tồn tại hoặc đã bị tắt.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enter name
  if (!started || !session) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-xl font-bold mb-1 text-center">{exam.title}</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {exam.questions.length} câu &middot; {exam.duration} phút
            </p>
            <div className="mb-4">
              <Label htmlFor="name">Tên của bạn</Label>
              <Input
                id="name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập tên để hiển thị trên bảng xếp hạng"
                className="mt-1"
              />
            </div>
            <Button className="w-full" size="lg" onClick={handleStart}>
              Bắt đầu làm bài
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Result
  if (session.finished) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ResultScore score={score} total={session.questions.length} />
            <div className="flex gap-3 justify-center mt-6">
              <LinkButton href={`/share/${shareCode}/leaderboard`} variant="outline">Bảng xếp hạng</LinkButton>
              <LinkButton href={`/share/${shareCode}`} variant="outline">Quay lại</LinkButton>
            </div>
          </CardContent>
        </Card>
        <h3 className="text-lg font-semibold mb-3">Chi tiết</h3>
        {session.questions.map((q, i) => (
          <ReviewItem key={q.id} question={q} index={i} selectedAnswer={session.selectedAnswers[i]} />
        ))}
      </div>
    );
  }

  // Active exam
  const currentQ = session.questions[session.currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white">
        <div className="max-w-4xl mx-auto flex items-center h-14 px-4">
          <span className="font-bold">{exam.title}</span>
          <ExamTimer timeLeft={timeLeft} />
        </div>
      </div>

      <div className="pt-16 px-4">
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
              <Button variant="destructive" className="ml-auto" onClick={() => setConfirmSubmit(true)}>
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
