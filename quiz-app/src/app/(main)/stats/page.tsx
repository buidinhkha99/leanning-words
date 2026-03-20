'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import * as historyService from '@/lib/services/history.service';
import { PracticeHistory, ExamHistory } from '@/lib/types/history';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreChart } from '@/components/stats/ScoreChart';
import { AccuracyPieChart } from '@/components/stats/AccuracyPieChart';
import { scorePercent } from '@/lib/utils/helpers';
import { Target, TrendingUp, Award } from 'lucide-react';

export default function StatsPage() {
  const { user } = useAuth();
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      historyService.getPracticeHistory(user.uid),
      historyService.getExamHistory(user.uid),
    ]).then(([ph, eh]) => {
      setPracticeHistory(ph);
      setExamHistory(eh);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const allHistory = [...practiceHistory, ...examHistory];
  const totalSessions = allHistory.length;
  const totalCorrect = allHistory.reduce((s, h) => s + h.score, 0);
  const totalQuestions = allHistory.reduce((s, h) => s + h.total, 0);
  const avgScore =
    allHistory.length > 0
      ? Math.round(
          allHistory.reduce((s, h) => s + scorePercent(h.score, h.total), 0) / allHistory.length
        )
      : 0;

  const chartData = allHistory
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((h) => ({
      date: new Date(h.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
      score: scorePercent(h.score, h.total),
    }));

  return (
    <div>
      <PageTitle title="Thống kê" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-3xl font-bold">{totalSessions}</div>
            <div className="text-sm text-muted-foreground">Tổng lượt làm bài</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-3xl font-bold">{avgScore}%</div>
            <div className="text-sm text-muted-foreground">Điểm trung bình</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-3xl font-bold">{totalCorrect}</div>
            <div className="text-sm text-muted-foreground">Câu trả lời đúng</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Điểm theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tỉ lệ đúng / sai</CardTitle>
          </CardHeader>
          <CardContent>
            <AccuracyPieChart
              correct={totalCorrect}
              wrong={totalQuestions - totalCorrect}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
