'use client';

import { useEffect, useState, use } from 'react';
import { getSharedExam } from '@/lib/services/exam.service';
import { getLeaderboard } from '@/lib/services/leaderboard.service';
import { SharedExam, ExamAttempt } from '@/lib/types/exam';
import { LeaderboardTable } from '@/components/stats/LeaderboardTable';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = use(params);
  const [exam, setExam] = useState<SharedExam | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSharedExam(shareCode), getLeaderboard(shareCode)]).then(
      ([e, a]) => {
        setExam(e);
        setAttempts(a);
        setLoading(false);
      }
    );
  }, [shareCode]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Đề thi không tồn tại.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PageTitle
        title={`Bảng xếp hạng - ${exam.title}`}
        action={
          <LinkButton href={`/share/${shareCode}`} variant="outline" size="sm">Quay lại</LinkButton>
        }
      />

      {attempts.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-12 w-12 text-muted-foreground" />}
          message="Chưa có ai làm bài."
          action={
            <LinkButton href={`/share/${shareCode}/quiz`}>Làm bài đầu tiên</LinkButton>
          }
        />
      ) : (
        <LeaderboardTable attempts={attempts} />
      )}
    </div>
  );
}
