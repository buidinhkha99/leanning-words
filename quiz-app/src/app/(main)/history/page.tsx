'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PracticeHistory, ExamHistory } from '@/lib/types/history';
import * as historyService from '@/lib/services/history.service';
import { PageTitle } from '@/components/shared/PageTitle';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Clock } from 'lucide-react';
import { formatDate, scorePercent, formatTime } from '@/lib/utils/helpers';

export default function HistoryPage() {
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
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Lịch sử làm bài" />

      <Tabs defaultValue="practice">
        <TabsList className="mb-4">
          <TabsTrigger value="practice">Ôn tập ({practiceHistory.length})</TabsTrigger>
          <TabsTrigger value="exam">Thi ({examHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          {practiceHistory.length === 0 ? (
            <EmptyState
              icon={<History className="h-12 w-12 text-muted-foreground" />}
              message="Chưa có lịch sử ôn tập."
            />
          ) : (
            <div className="space-y-3">
              {practiceHistory.map((h) => (
                <Link key={h.id} href={`/history/practice/${h.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Ôn tập</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(h.createdAt)}
                          </div>
                        </div>
                        <Badge
                          variant={scorePercent(h.score, h.total) >= 50 ? 'default' : 'destructive'}
                        >
                          {h.score}/{h.total} ({scorePercent(h.score, h.total)}%)
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exam">
          {examHistory.length === 0 ? (
            <EmptyState
              icon={<History className="h-12 w-12 text-muted-foreground" />}
              message="Chưa có lịch sử thi."
            />
          ) : (
            <div className="space-y-3">
              {examHistory.map((h) => (
                <Link key={h.id} href={`/history/exam/${h.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{h.examTitle}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{formatDate(h.createdAt)}</span>
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(h.timeTaken)}</span>
                          </div>
                        </div>
                        <Badge
                          variant={scorePercent(h.score, h.total) >= 50 ? 'default' : 'destructive'}
                        >
                          {h.score}/{h.total} ({scorePercent(h.score, h.total)}%)
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
