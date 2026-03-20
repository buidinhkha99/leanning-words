'use client';

import { ExamAttempt } from '@/lib/types/exam';
import { formatTime, formatDate, scorePercent } from '@/lib/utils/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  attempts: ExamAttempt[];
}

export function LeaderboardTable({ attempts }: LeaderboardTableProps) {
  // Sort by score desc, then timeTaken asc
  const sorted = [...attempts].sort((a, b) => {
    const scoreDiff = scorePercent(b.score, b.total) - scorePercent(a.score, a.total);
    if (scoreDiff !== 0) return scoreDiff;
    return a.timeTaken - b.timeTaken;
  });

  return (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Điểm</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Ngày</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((attempt, i) => (
            <TableRow key={attempt.id}>
              <TableCell>
                {i < 3 ? (
                  <Trophy
                    className={`h-4 w-4 ${
                      i === 0
                        ? 'text-yellow-500'
                        : i === 1
                          ? 'text-gray-400'
                          : 'text-orange-400'
                    }`}
                  />
                ) : (
                  i + 1
                )}
              </TableCell>
              <TableCell className="font-medium">{attempt.playerName}</TableCell>
              <TableCell>
                <Badge variant={scorePercent(attempt.score, attempt.total) >= 50 ? 'default' : 'destructive'}>
                  {attempt.score}/{attempt.total} ({scorePercent(attempt.score, attempt.total)}%)
                </Badge>
              </TableCell>
              <TableCell>{formatTime(attempt.timeTaken)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(attempt.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
