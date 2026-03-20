'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/ui/link-button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Shuffle,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import * as questionService from '@/lib/services/question.service';
import * as examService from '@/lib/services/exam.service';
import * as historyService from '@/lib/services/history.service';
import { scorePercent } from '@/lib/utils/helpers';
import { PracticeHistory, ExamHistory } from '@/lib/types/history';
import { ScoreChart } from '@/components/stats/ScoreChart';
import { AccuracyPieChart } from '@/components/stats/AccuracyPieChart';

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days === 1) return 'Hôm qua';
  return `${days} ngày trước`;
}

interface DashboardStats {
  questions: number;
  exams: number;
  sessions: number;
  avgScore: number;
  totalCorrect: number;
  totalQuestions: number;
  practiceHistory: PracticeHistory[];
  examHistory: ExamHistory[];
}

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [qs, es, ph, eh] = await Promise.all([
        questionService.getQuestions(user!.uid),
        examService.getExams(user!.uid),
        historyService.getPracticeHistory(user!.uid),
        historyService.getExamHistory(user!.uid),
      ]);
      const allScores = [...ph, ...eh];
      const avgScore =
        allScores.length > 0
          ? Math.round(
              allScores.reduce((s, h) => s + scorePercent(h.score, h.total), 0) /
                allScores.length
            )
          : 0;
      const totalCorrect = allScores.reduce((s, h) => s + h.score, 0);
      const totalQuestions = allScores.reduce((s, h) => s + h.total, 0);
      setStats({
        questions: qs.length,
        exams: es.length,
        sessions: allScores.length,
        avgScore,
        totalCorrect,
        totalQuestions,
        practiceHistory: ph,
        examHistory: eh,
      });
    }
    load();
  }, [user]);

  if (!stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'bạn';

  const allHistory = [...stats.practiceHistory, ...stats.examHistory];
  const recentActivity = allHistory
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const chartData = allHistory
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((h) => ({
      date: new Date(h.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
      score: scorePercent(h.score, h.total),
    }));

  const weeklyGoal = 20;
  const weeklyDone = Math.min(stats.sessions, weeklyGoal);
  const weeklyPercent = Math.round((weeklyDone / weeklyGoal) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Chào, {displayName} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Hôm nay bạn muốn chinh phục kiến thức nào?
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left/Center Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Bank Hero Card */}
          <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground shadow-lg">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Câu hỏi trong ngân hàng
                  </p>
                  <p className="text-3xl md:text-4xl font-black mt-1">
                    {stats.questions.toLocaleString()} CÂU
                  </p>
                </div>
              </div>
              <LinkButton
                href="/questions"
                className="bg-white text-primary hover:bg-white/90 font-bold self-start sm:self-center"
              >
                Quản lý
              </LinkButton>
            </div>
            {/* Decorative icon */}
            <BookOpen className="absolute -right-6 -bottom-6 h-40 w-40 opacity-10" />
          </div>

          {/* Summary Statistics */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Thống kê tổng quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border shadow-none">
                <CardContent className="flex flex-col items-center text-center py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 text-primary mb-3">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black">{stats.sessions}</p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    Tổng lượt làm bài
                  </p>
                </CardContent>
              </Card>
              <Card className="border shadow-none">
                <CardContent className="flex flex-col items-center text-center py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-200 text-emerald-500 mb-3">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black">{stats.avgScore}%</p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    Điểm trung bình
                  </p>
                </CardContent>
              </Card>
              <Card className="border shadow-none">
                <CardContent className="flex flex-col items-center text-center py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-200 text-purple-500 mb-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black">{stats.totalCorrect}</p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    Câu trả lời đúng
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Điểm theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreChart data={chartData} />
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Tỉ lệ đúng / sai</CardTitle>
              </CardHeader>
              <CardContent>
                <AccuracyPieChart
                  correct={stats.totalCorrect}
                  wrong={stats.totalQuestions - stats.totalCorrect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/practice"
              className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-primary mb-4 group-hover:scale-110 transition-transform">
                <Shuffle className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-2">Ôn tập ngẫu nhiên</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Hệ thống sẽ tự động chọn lọc câu hỏi phù hợp nhất với trình độ của bạn.
              </p>
            </Link>
            <Link
              href="/exams"
              className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-2">Đề thi của tôi</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Xem lại danh sách các bộ đề bạn đã tạo và tùy chỉnh lộ trình ôn thi.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Recent Activity */}
          <Card className="border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Hoạt động gần đây</h3>
                <LinkButton
                  href="/history"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary font-bold"
                >
                  Tất cả
                </LinkButton>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Chưa có hoạt động nào
                </p>
              ) : (
                <div className="space-y-5">
                  {recentActivity.map((item) => {
                    const isExam = 'examTitle' in item;
                    const title = isExam
                      ? (item as ExamHistory).examTitle
                      : 'Ôn tập';
                    const score = (item.score / item.total * 10).toFixed(1);
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                          {isExam ? (
                            <ClipboardList className="h-4 w-4" />
                          ) : (
                            <Shuffle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <h4 className="font-bold text-sm truncate">{title}</h4>
                            <span className="text-primary font-bold text-sm shrink-0">
                              {score}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Hoàn thành {timeAgo(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Progress Card */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Mục tiêu tuần
              </p>
              <span className="bg-white/10 text-[10px] px-2 py-1 rounded font-bold">
                {stats.sessions > 0
                  ? `LVL ${Math.min(Math.floor(stats.sessions / 2) + 1, 99)}`
                  : 'LVL 1'}
              </span>
            </div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-black">{weeklyPercent}%</span>
              <span className="text-[11px] opacity-70">
                {weeklyDone}/{weeklyGoal} Bài tập
              </span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${weeklyPercent}%` }}
              />
            </div>
            <p className="mt-4 text-[12px] leading-relaxed opacity-80 font-medium">
              {weeklyDone >= weeklyGoal
                ? 'Tuyệt vời! Bạn đã hoàn thành mục tiêu tuần này.'
                : `Chỉ còn ${weeklyGoal - weeklyDone} bài tập nữa để đạt mục tiêu tuần.`}
            </p>
            <LinkButton
              href="/stats"
              variant="outline"
              className="w-full mt-4 border-white/20 text-white hover:bg-white/5 text-xs font-bold"
            >
              Xem chi tiết
            </LinkButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
