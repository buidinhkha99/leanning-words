'use client';

import { useEffect, useState, use } from 'react';
import { getSharedExam } from '@/lib/services/exam.service';
import { SharedExam } from '@/lib/types/exam';
import { Card, CardContent } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Trophy } from 'lucide-react';

export default function SharedExamInfoPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = use(params);
  const [exam, setExam] = useState<SharedExam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedExam(shareCode).then((e) => {
      setExam(e);
      setLoading(false);
    });
  }, [shareCode]);

  if (loading) return <div className="max-w-lg mx-auto p-4"><Skeleton className="h-64" /></div>;

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

  return (
    <div className="max-w-lg mx-auto p-4">
      <Card>
        <CardContent className="pt-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
          {exam.description && (
            <p className="text-muted-foreground mb-4">{exam.description}</p>
          )}
          <div className="flex gap-2 justify-center mb-6">
            <Badge variant="secondary">{exam.questions.length} câu</Badge>
            <Badge variant="secondary">{exam.duration} phút</Badge>
            <Badge variant="outline">bởi {exam.ownerName}</Badge>
          </div>
          <div className="space-y-3">
            <LinkButton href={`/share/${shareCode}/quiz`} size="lg" className="w-full">Bắt đầu làm bài</LinkButton>
            <LinkButton href={`/share/${shareCode}/leaderboard`} variant="outline" className="w-full">
              <Trophy className="h-4 w-4 mr-2" />
              Bảng xếp hạng
            </LinkButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
