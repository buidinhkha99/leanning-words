import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { QuestionInput } from '../types/question';

export interface ImportRow {
  text: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string; // 'A', 'B', 'C', 'D' or index
  error?: string;
}

function normalizeCorrectAnswer(val: string): number {
  const upper = val.trim().toUpperCase();
  const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '0': 0, '1': 1, '2': 2, '3': 3 };
  return map[upper] ?? -1;
}

function rowsToImportRows(rows: Record<string, string>[]): ImportRow[] {
  return rows.map((row) => {
    const keys = Object.keys(row);
    // Try to auto-detect column mapping
    const text = row[keys[0]] || '';
    const answerA = row[keys[1]] || '';
    const answerB = row[keys[2]] || '';
    const answerC = row[keys[3]] || '';
    const answerD = row[keys[4]] || '';
    const correctAnswer = row[keys[5]] || '';

    return { text, answerA, answerB, answerC, answerD, correctAnswer };
  });
}

function validateRow(row: ImportRow): ImportRow {
  const errors: string[] = [];
  if (!row.text?.trim()) errors.push('Thiếu câu hỏi');
  if (!row.answerA?.trim() || !row.answerB?.trim()) errors.push('Cần ít nhất 2 đáp án');
  if (normalizeCorrectAnswer(row.correctAnswer) === -1) errors.push('Đáp án đúng không hợp lệ');
  return { ...row, error: errors.length > 0 ? errors.join(', ') : undefined };
}

export function parseExcel(buffer: ArrayBuffer): ImportRow[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
  return rowsToImportRows(rows).map(validateRow);
}

export function parseCSV(text: string): ImportRow[] {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return rowsToImportRows(result.data).map(validateRow);
}

export function parseJSON(text: string): ImportRow[] {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];

  return arr
    .map((item): ImportRow => {
      if (item.text && item.answers && Array.isArray(item.answers)) {
        return {
          text: item.text,
          answerA: item.answers[0] || '',
          answerB: item.answers[1] || '',
          answerC: item.answers[2] || '',
          answerD: item.answers[3] || '',
          correctAnswer: String(item.correctAnswer ?? item.correctIndex ?? ''),
        };
      }
      // Flat format
      return {
        text: item.text || item.question || '',
        answerA: item.answerA || item.a || '',
        answerB: item.answerB || item.b || '',
        answerC: item.answerC || item.c || '',
        answerD: item.answerD || item.d || '',
        correctAnswer: String(item.correctAnswer || item.correct || ''),
      };
    })
    .map(validateRow);
}

export function importRowsToQuestions(rows: ImportRow[]): QuestionInput[] {
  return rows
    .filter((r) => !r.error)
    .map((r) => ({
      text: r.text.trim(),
      answers: [r.answerA.trim(), r.answerB.trim(), r.answerC.trim(), r.answerD.trim()].filter(
        (a) => a !== ''
      ),
      correctIndex: normalizeCorrectAnswer(r.correctAnswer),
    }))
    .filter((q) => q.correctIndex >= 0 && q.correctIndex < q.answers.length);
}
