import { describe, it, expect } from 'vitest';
import { parseCSV, parseJSON, importRowsToQuestions } from '@/lib/services/import.service';

describe('parseCSV', () => {
  it('should parse valid CSV with headers', () => {
    const csv = `text,answerA,answerB,answerC,answerD,correctAnswer
What is 1+1?,1,2,3,4,B
What is 2+2?,3,4,5,6,B`;

    const rows = parseCSV(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0].text).toBe('What is 1+1?');
    expect(rows[0].answerA).toBe('1');
    expect(rows[0].answerB).toBe('2');
    expect(rows[0].correctAnswer).toBe('B');
    expect(rows[0].error).toBeUndefined();
  });

  it('should set error on missing text', () => {
    const csv = `text,answerA,answerB,answerC,answerD,correctAnswer
,1,2,3,4,B`;

    const rows = parseCSV(csv);
    expect(rows[0].error).toContain('Thiếu câu hỏi');
  });

  it('should set error on missing answers', () => {
    const csv = `text,answerA,answerB,answerC,answerD,correctAnswer
Question?,,,,, B`;

    const rows = parseCSV(csv);
    expect(rows[0].error).toContain('Cần ít nhất 2 đáp án');
  });

  it('should set error on invalid correctAnswer', () => {
    const csv = `text,answerA,answerB,answerC,answerD,correctAnswer
Question?,a,b,c,d,X`;

    const rows = parseCSV(csv);
    expect(rows[0].error).toContain('Đáp án đúng không hợp lệ');
  });
});

describe('parseJSON', () => {
  it('should parse array format with answers array', () => {
    const json = JSON.stringify([
      {
        text: 'Q1?',
        answers: ['a', 'b', 'c', 'd'],
        correctAnswer: 'A',
      },
    ]);

    const rows = parseJSON(json);
    expect(rows).toHaveLength(1);
    expect(rows[0].text).toBe('Q1?');
    expect(rows[0].answerA).toBe('a');
    expect(rows[0].answerB).toBe('b');
    expect(rows[0].correctAnswer).toBe('A');
    expect(rows[0].error).toBeUndefined();
  });

  it('should parse flat format with alternative keys', () => {
    const json = JSON.stringify([
      {
        question: 'Q1?',
        a: 'opt1',
        b: 'opt2',
        c: 'opt3',
        d: 'opt4',
        correct: 'B',
      },
    ]);

    const rows = parseJSON(json);
    expect(rows[0].text).toBe('Q1?');
    expect(rows[0].answerA).toBe('opt1');
    expect(rows[0].correctAnswer).toBe('B');
    expect(rows[0].error).toBeUndefined();
  });

  it('should parse single object (not array)', () => {
    const json = JSON.stringify({
      text: 'Q1?',
      answers: ['a', 'b', 'c', 'd'],
      correctIndex: 0,
    });

    const rows = parseJSON(json);
    expect(rows).toHaveLength(1);
    expect(rows[0].text).toBe('Q1?');
    expect(rows[0].correctAnswer).toBe('0');
  });

  it('should support correctIndex as number', () => {
    const json = JSON.stringify([
      {
        text: 'Q?',
        answers: ['a', 'b'],
        correctIndex: 1,
      },
    ]);

    const rows = parseJSON(json);
    expect(rows[0].correctAnswer).toBe('1');
  });
});

describe('importRowsToQuestions', () => {
  it('should filter out rows with errors', () => {
    const rows = [
      { text: 'Q1?', answerA: 'a', answerB: 'b', answerC: '', answerD: '', correctAnswer: 'A' },
      {
        text: '',
        answerA: 'a',
        answerB: 'b',
        answerC: '',
        answerD: '',
        correctAnswer: 'A',
        error: 'Thiếu câu hỏi',
      },
    ];

    const questions = importRowsToQuestions(rows);
    expect(questions).toHaveLength(1);
    expect(questions[0].text).toBe('Q1?');
  });

  it('should map A/B/C/D to 0/1/2/3', () => {
    const rows = [
      { text: 'Q1?', answerA: 'a', answerB: 'b', answerC: 'c', answerD: 'd', correctAnswer: 'A' },
      { text: 'Q2?', answerA: 'a', answerB: 'b', answerC: 'c', answerD: 'd', correctAnswer: 'B' },
      { text: 'Q3?', answerA: 'a', answerB: 'b', answerC: 'c', answerD: 'd', correctAnswer: 'C' },
      { text: 'Q4?', answerA: 'a', answerB: 'b', answerC: 'c', answerD: 'd', correctAnswer: 'D' },
    ];

    const questions = importRowsToQuestions(rows);
    expect(questions[0].correctIndex).toBe(0);
    expect(questions[1].correctIndex).toBe(1);
    expect(questions[2].correctIndex).toBe(2);
    expect(questions[3].correctIndex).toBe(3);
  });

  it('should strip empty answers', () => {
    const rows = [
      { text: 'Q?', answerA: 'a', answerB: 'b', answerC: '', answerD: '', correctAnswer: 'A' },
    ];

    const questions = importRowsToQuestions(rows);
    expect(questions[0].answers).toEqual(['a', 'b']);
  });

  it('should trim whitespace from text and answers', () => {
    const rows = [
      {
        text: '  Q?  ',
        answerA: ' a ',
        answerB: ' b ',
        answerC: '',
        answerD: '',
        correctAnswer: 'A',
      },
    ];

    const questions = importRowsToQuestions(rows);
    expect(questions[0].text).toBe('Q?');
    expect(questions[0].answers).toEqual(['a', 'b']);
  });

  it('should filter out questions with invalid correctIndex after mapping', () => {
    const rows = [
      { text: 'Q?', answerA: 'a', answerB: 'b', answerC: '', answerD: '', correctAnswer: 'D' },
    ];

    // D maps to index 3, but only 2 answers exist (a, b) -> filtered out
    const questions = importRowsToQuestions(rows);
    expect(questions).toHaveLength(0);
  });
});
