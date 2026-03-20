import { test as teardown } from '@playwright/test';

teardown('cleanup test data', async ({ page }) => {
  // Navigate to question bank and delete [E2E] prefixed items
  await page.goto('/questions');

  // Delete all questions with [E2E] prefix
  const e2eQuestions = page.locator('text=[E2E]');
  const count = await e2eQuestions.count();

  for (let i = count - 1; i >= 0; i--) {
    const deleteBtn = page
      .locator('[data-testid="question-item"]')
      .filter({ hasText: '[E2E]' })
      .first()
      .getByRole('button', { name: /xoa|delete/i });

    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.click();
      // Confirm dialog if present
      const confirmBtn = page.getByRole('button', { name: /xac nhan|confirm|xoa/i });
      if ((await confirmBtn.count()) > 0) {
        await confirmBtn.click();
      }
      await page.waitForTimeout(500);
    }
  }

  // Navigate to exams and delete [E2E] prefixed exams
  await page.goto('/exams');

  const e2eExams = page.locator('text=[E2E]');
  const examCount = await e2eExams.count();

  for (let i = examCount - 1; i >= 0; i--) {
    const deleteBtn = page
      .locator('[data-testid="exam-item"]')
      .filter({ hasText: '[E2E]' })
      .first()
      .getByRole('button', { name: /xoa|delete/i });

    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.click();
      const confirmBtn = page.getByRole('button', { name: /xac nhan|confirm|xoa/i });
      if ((await confirmBtn.count()) > 0) {
        await confirmBtn.click();
      }
      await page.waitForTimeout(500);
    }
  }
});
