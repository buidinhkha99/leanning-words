'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import * as historyService from '@/lib/services/history.service';
import { PracticeHistory, ExamHistory } from '@/lib/types/history';
import { ResultScore } from '@/components/quiz/ResultScore';
import { ReviewItem } from '@/components/quiz/ReviewItem';
import { Card, CardContent } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatTime } from '@/lib/utils/helpers';

export default function HistoryDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = use(params);
  const { user } = useAuth();
  const [data, setData] = useState<PracticeHistory | ExamHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load =
      type === 'practice'
        ? historyService.getPracticeHistoryItem(user.uid, id)
        : historyService.getExamHistoryItem(user.uid, id);
    load.then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [user, type, id]);

  if (loading) return <Skeleton className="h-64" />;
  if (!data) return <p className="text-muted-foreground">Không tìm thấy.</p>;

  const isExam = type === 'exam';
  const examData = isExam ? (data as ExamHistory) : null;

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h1 className="text-xl font-bold mb-1">
            {isExam ? examData!.examTitle : 'Ôn tập'}
          </h1>
          <div className="text-sm text-muted-foreground mb-4">
            {formatDate(data.createdAt)}
            {examData && ` · Thời gian: ${formatTime(examData.timeTaken)}`}
          </div>
          <ResultScore score={data.score} total={data.total} />
          <div className="mt-4 text-center">
            <LinkButton href="/history" variant="outline">Quay lại</LinkButton>
          </div>
        </CardContent>
      </Card>
      <h3 className="text-lg font-semibold mb-3">Chi tiết</h3>
      {data.questions.map((q, i) => (
        <ReviewItem
          key={q.id}
          question={q}
          index={i}
          selectedAnswer={data.selectedAnswers[i]}
        />
      ))}
    </div>
  );
}
