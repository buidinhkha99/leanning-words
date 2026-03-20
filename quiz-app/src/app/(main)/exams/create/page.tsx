'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useExams } from '@/lib/hooks/useExams';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateExamPage() {
  const router = useRouter();
  const { add } = useExams();
  const { questions, loading: qLoading } = useQuestions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleQuestion = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 câu hỏi');
      return;
    }
    setSubmitting(true);
    try {
      await add({
        title: title.trim(),
        description: description.trim(),
        questionIds: selectedIds,
        duration: parseInt(duration) || 30,
      });
      toast.success('Đã tạo đề thi');
      router.push('/exams');
    } catch {
      toast.error('Tạo đề thi thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (qLoading) return <Skeleton className="h-64" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo đề thi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tên đề thi</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đề thi cuối kỳ"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="desc">Mô tả</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về đề thi..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="duration">Thời gian (phút)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-32"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Chọn câu hỏi ({selectedIds.length}/{questions.length})</Label>
              <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                {selectedIds.length === questions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            </div>
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Chưa có câu hỏi nào trong ngân hàng.
              </p>
            ) : (
              <div className="border rounded-lg max-h-64 overflow-auto divide-y">
                {questions.map((q) => (
                  <label
                    key={q.id}
                    className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => toggleQuestion(q.id)}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">{q.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Đang tạo...' : 'Tạo đề thi'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/exams')}>
              Huỷ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
