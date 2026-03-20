import { test, expect } from '@playwright/test';

test.describe('Exam Session', () => {
  test('shows exam info before starting', async ({ page }) => {
    await page.goto('/exams');

    await page.waitForTimeout(2000);

    const playLink = page.locator('a[href*="/quiz/"]').first();
    if (!(await playLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No exams available');
      return;
    }

    await playLink.click();

    await expect(page.getByRole('button', { name: /Bắt đầu làm bài/i })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/câu hỏi/)).toBeVisible();
    await expect(page.getByText(/phút/)).toBeVisible();
  });

  test('take exam: timer, navigation, submit, and result', async ({ page }) => {
    await page.goto('/exams');

    await page.waitForTimeout(2000);

    const playLink = page.locator('a[href*="/quiz/"]').first();
    if (!(await playLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No exams available');
      return;
    }

    await playLink.click();

    const startBtn = page.getByRole('button', { name: /Bắt đầu làm bài/i });
    await expect(startBtn).toBeVisible({ timeout: 10000 });
    await startBtn.click();

    // Timer should be visible
    await expect(page.locator('text=/\\d{2}:\\d{2}/')).toBeVisible({ timeout: 5000 });

    // Question nav should be visible
    await expect(page.locator('button, [role="button"]').filter({ hasText: '1' })).toBeVisible();

    // Select first answer
    const options = page.locator('.space-y-2 button, .grid button, [data-testid="option-button"]');
    if (await options.first().isVisible({ timeout: 3000 })) {
      await options.first().click();
    }

    // Navigate to next question if exists
    const nextBtn = page.getByRole('button', { name: /Tiếp/i });
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
    }

    // Submit the exam
    await page.getByRole('button', { name: /Nộp bài/i }).click();

    // Confirm dialog
    await expect(page.getByText(/Bạn có chắc muốn nộp bài/)).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    // Should show result
    await expect(page.getByText('Chi tiết').or(page.getByText(/\/\d+/))).toBeVisible({
      timeout: 15000,
    });
  });
});
