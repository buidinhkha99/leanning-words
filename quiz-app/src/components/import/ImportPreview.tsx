'use client';

import { ImportRow } from '@/lib/services/import.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface ImportPreviewProps {
  rows: ImportRow[];
  onRemoveRow: (index: number) => void;
  onImport: () => void;
  importing: boolean;
}

export function ImportPreview({ rows, onRemoveRow, onImport, importing }: ImportPreviewProps) {
  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.filter((r) => r.error).length;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Badge variant="default">{validCount} hợp lệ</Badge>
        {errorCount > 0 && <Badge variant="destructive">{errorCount} lỗi</Badge>}
        <Button onClick={onImport} disabled={validCount === 0 || importing} className="ml-auto">
          {importing ? 'Đang import...' : `Import ${validCount} câu hỏi`}
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Câu hỏi</TableHead>
              <TableHead>A</TableHead>
              <TableHead>B</TableHead>
              <TableHead>C</TableHead>
              <TableHead>D</TableHead>
              <TableHead>Đáp án</TableHead>
              <TableHead className="w-20">Trạng thái</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} className={row.error ? 'bg-red-50' : ''}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="max-w-48 truncate">{row.text}</TableCell>
                <TableCell className="max-w-20 truncate">{row.answerA}</TableCell>
                <TableCell className="max-w-20 truncate">{row.answerB}</TableCell>
                <TableCell className="max-w-20 truncate">{row.answerC}</TableCell>
                <TableCell className="max-w-20 truncate">{row.answerD}</TableCell>
                <TableCell>{row.correctAnswer}</TableCell>
                <TableCell>
                  {row.error ? (
                    <Badge variant="destructive" className="text-xs">
                      Lỗi
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      OK
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveRow(i)}
                    className="h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
