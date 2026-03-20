'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useExams } from '@/lib/hooks/useExams';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageTitle } from '@/components/shared/PageTitle';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Play, Pencil, Trash2, FileText, Share2, Copy, Link as LinkIcon } from 'lucide-react';
import { shareExam, unshareExam } from '@/lib/services/exam.service';

export default function ExamListPage() {
  const { user } = useAuth();
  const { exams, loading, remove, refresh } = useExams();
  const { questions } = useQuestions();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [shareExamId, setShareExamId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success('Đã xoá đề thi');
    } catch {
      toast.error('Xoá thất bại');
    }
    setDeleteId(null);
  };

  const handleShare = async (examId: string) => {
    if (!user) return;
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;
    try {
      await shareExam(user.uid, examId, exam, questions, user.displayName || 'User');
      await refresh();
      setShareExamId(examId);
      toast.success('Đã chia sẻ đề thi');
    } catch {
      toast.error('Chia sẻ thất bại');
    }
  };

  const handleUnshare = async (examId: string, shareCode: string) => {
    if (!user) return;
    try {
      await unshareExam(user.uid, examId, shareCode);
      await refresh();
      setShareExamId(null);
      toast.success('Đã huỷ chia sẻ');
    } catch {
      toast.error('Huỷ chia sẻ thất bại');
    }
  };

  const shareExamData = shareExamId ? exams.find((e) => e.id === shareExamId) : null;
  const shareUrl = shareExamData?.shareCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareExamData.shareCode}`
    : '';

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Đề thi"
        action={
          <LinkButton href="/exams/create" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tạo đề thi
          </LinkButton>
        }
      />

      {exams.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
          message="Chưa có đề thi nào."
          action={
            <LinkButton href="/exams/create">Tạo đề thi đầu tiên</LinkButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg">{exam.title}</div>
                    {exam.description && (
                      <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {exam.questionIds.length} câu
                      </Badge>
                      <Badge variant="secondary">{exam.duration} phút</Badge>
                      {exam.shareCode && (
                        <Badge variant="default" className="cursor-pointer" onClick={() => setShareExamId(exam.id)}>
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Đã chia sẻ
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <LinkButton href={`/quiz/${exam.id}`} variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </LinkButton>
                    {!exam.shareCode ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleShare(exam.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShareExamId(exam.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}
                    <LinkButton href={`/exams/edit/${exam.id}`} variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </LinkButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xoá đề thi"
        description="Bạn có chắc muốn xoá đề thi này?"
        onConfirm={handleDelete}
      />

      {/* Share Dialog */}
      <Dialog open={!!shareExamId} onOpenChange={(open) => !open && setShareExamId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chia sẻ đề thi</DialogTitle>
            <DialogDescription>
              {shareExamData?.shareCode
                ? 'Bất kỳ ai có link đều có thể làm bài thi này.'
                : 'Tạo link chia sẻ đề thi.'}
            </DialogDescription>
          </DialogHeader>
          {shareExamData?.shareCode ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Đã copy link');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUnshare(shareExamData.id, shareExamData.shareCode!)}
              >
                Huỷ chia sẻ
              </Button>
            </div>
          ) : (
            <Button onClick={() => shareExamId && handleShare(shareExamId)}>
              Tạo link chia sẻ
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
