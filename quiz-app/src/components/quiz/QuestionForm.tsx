'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LABELS } from '@/lib/utils/constants';
import { QuestionInput } from '@/lib/types/question';

interface QuestionFormProps {
  initialData?: { text: string; answers: string[]; correctIndex: number };
  onSubmit: (data: QuestionInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function QuestionForm({ initialData, onSubmit, onCancel, submitLabel }: QuestionFormProps) {
  const [text, setText] = useState(initialData?.text || '');
  const [answers, setAnswers] = useState<string[]>(
    initialData?.answers || ['', '', '', '']
  );
  const [correctIndex, setCorrectIndex] = useState(
    initialData?.correctIndex?.toString() || '0'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        answers: answers.map((a) => a.trim()),
        correctIndex: parseInt(correctIndex),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel === 'Cập nhật' ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question-text">Câu hỏi</Label>
            <Textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung câu hỏi..."
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Các đáp án (chọn đáp án đúng)</Label>
            <RadioGroup
              value={correctIndex}
              onValueChange={setCorrectIndex}
              className="mt-2 space-y-2"
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <RadioGroupItem value={String(i)} id={`answer-${i}`} />
                  <span className="font-semibold w-5">{LABELS[i]}.</span>
                  <Input
                    value={answers[i]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[i] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder={`Đáp án ${LABELS[i]}`}
                    required
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Huỷ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
