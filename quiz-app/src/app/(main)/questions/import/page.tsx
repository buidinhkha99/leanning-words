'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { PageTitle } from '@/components/shared/PageTitle';
import { FileUploader } from '@/components/import/FileUploader';
import { ImportPreview } from '@/components/import/ImportPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import {
  ImportRow,
  parseExcel,
  parseCSV,
  parseJSON,
  importRowsToQuestions,
} from '@/lib/services/import.service';

export default function ImportPage() {
  const router = useRouter();
  const { batchImport } = useQuestions();
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let parsed: ImportRow[];

      if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        parsed = parseExcel(buffer);
      } else if (ext === 'csv') {
        const text = await file.text();
        parsed = parseCSV(text);
      } else if (ext === 'json') {
        const text = await file.text();
        parsed = parseJSON(text);
      } else {
        toast.error('Định dạng file không được hỗ trợ');
        return;
      }

      if (parsed.length === 0) {
        toast.error('File không có dữ liệu');
        return;
      }

      setRows(parsed);
      toast.success(`Đã đọc ${parsed.length} dòng`);
    } catch {
      toast.error('Lỗi khi đọc file');
    }
  };

  const handleImport = async () => {
    const questions = importRowsToQuestions(rows);
    if (questions.length === 0) {
      toast.error('Không có câu hỏi hợp lệ để import');
      return;
    }

    setImporting(true);
    try {
      const count = await batchImport(questions);
      toast.success(`Đã import ${count} câu hỏi`);
      router.push('/questions');
    } catch {
      toast.error('Lỗi khi import');
    } finally {
      setImporting(false);
    }
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const downloadTemplate = () => {
    const template = [
      { 'Câu hỏi': 'Thủ đô Việt Nam là gì?', 'Đáp án A': 'Hà Nội', 'Đáp án B': 'Hồ Chí Minh', 'Đáp án C': 'Đà Nẵng', 'Đáp án D': 'Huế', 'Đáp án đúng': 'A' },
    ];
    const csv = [
      Object.keys(template[0]).join(','),
      ...template.map((r) => Object.values(r).join(',')),
    ].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-import-cau-hoi.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageTitle title="Import câu hỏi" />

      {rows.length === 0 ? (
        <div className="space-y-4">
          <FileUploader
            onFileLoaded={handleFile}
            accept=".xlsx,.xls,.csv,.json"
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>File cần có 6 cột theo thứ tự: Câu hỏi, Đáp án A, B, C, D, Đáp án đúng (A/B/C/D)</p>
              <p>Dòng đầu tiên là header (tên cột).</p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-1" />
                Tải template mẫu
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <ImportPreview
            rows={rows}
            onRemoveRow={handleRemoveRow}
            onImport={handleImport}
            importing={importing}
          />
          <Button variant="outline" onClick={() => setRows([])}>
            Chọn file khác
          </Button>
        </div>
      )}
    </div>
  );
}
