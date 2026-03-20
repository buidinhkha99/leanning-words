'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useQuestions } from '@/lib/hooks/useQuestions';
import * as examService from '@/lib/services/exam.service';
import { Exam } from '@/lib/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { questions, loading: qLoading } = useQuestions();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    examService.getExam(user.uid, id).then((e) => {
      if (e) {
        setExam(e);
        setTitle(e.title);
        setDescription(e.description);
        setDuration(String(e.duration));
        setSelectedIds(e.questionIds);
      }
      setLoading(false);
    });
  }, [user, id]);

  const toggleQuestion = (qid: string) => {
    setSelectedIds((prev) =>
      prev.includes(qid) ? prev.filter((x) => x !== qid) : [...prev, qid]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !exam) return;
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 câu hỏi');
      return;
    }
    setSubmitting(true);
    try {
      await examService.updateExam(user.uid, id, {
        title: title.trim(),
        description: description.trim(),
        questionIds: selectedIds,
        duration: parseInt(duration) || 30,
      });
      toast.success('Đã cập nhật đề thi');
      router.push('/exams');
    } catch {
      toast.error('Cập nhật thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || qLoading) return <Skeleton className="h-64" />;
  if (!exam) return <p className="text-muted-foreground">Không tìm thấy đề thi.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sửa đề thi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tên đề thi</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="desc">Mô tả</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="duration">Thời gian (phút)</Label>
            <Input id="duration" type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 w-32" />
          </div>

          <div>
            <Label>Chọn câu hỏi ({selectedIds.length}/{questions.length})</Label>
            <div className="border rounded-lg max-h-64 overflow-auto divide-y mt-2">
              {questions.map((q) => (
                <label key={q.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer">
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : 'Cập nhật'}
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
