'use client';

import { useState } from 'react';
import { LinkButton } from '@/components/ui/link-button';
import { toast } from 'sonner';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { PageTitle } from '@/components/shared/PageTitle';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Upload, Pencil, Trash2, BookOpen } from 'lucide-react';
import { LABELS } from '@/lib/utils/constants';

export default function QuestionBankPage() {
  const { questions, loading, remove } = useQuestions();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success('Đã xoá câu hỏi');
    } catch {
      toast.error('Xoá thất bại');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Ngân hàng câu hỏi"
        action={
          <div className="flex gap-2">
            <LinkButton href="/questions/import" size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </LinkButton>
            <LinkButton href="/questions/add" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Thêm câu hỏi
            </LinkButton>
          </div>
        }
      />

      {questions.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
          message="Chưa có câu hỏi nào."
          action={
            <LinkButton href="/questions/add">Thêm câu hỏi đầu tiên</LinkButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-2">
                      Câu {i + 1}: {q.text}
                    </div>
                    <div className="space-y-1">
                      {q.answers.map((a, j) => (
                        <div
                          key={j}
                          className={`text-sm ${
                            j === q.correctIndex
                              ? 'text-green-700 font-semibold'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {LABELS[j]}. {a} {j === q.correctIndex && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <LinkButton href={`/questions/edit/${q.id}`} variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </LinkButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(q.id)}
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
        title="Xoá câu hỏi"
        description="Bạn có chắc muốn xoá câu hỏi này?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
