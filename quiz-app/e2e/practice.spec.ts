import { test, expect } from '@playwright/test';

test.describe('Practice Mode', () => {
  test('shows start screen with question count', async ({ page }) => {
    await page.goto('/practice');

    const startBtn = page.getByRole('button', { name: /Bắt đầu ôn tập/i });
    const emptyState = page.getByText('Chưa có câu hỏi nào');

    await expect(startBtn.or(emptyState)).toBeVisible({ timeout: 10000 });

    if (await startBtn.isVisible()) {
      await expect(page.getByText(/câu hỏi trong ngân hàng/)).toBeVisible();
    }
  });

  test('complete practice session and see results', async ({ page }) => {
    await page.goto('/practice');

    const startBtn = page.getByRole('button', { name: /Bắt đầu ôn tập/i });
    if (!(await startBtn.isVisible({ timeout: 10000 }).catch(() => false))) {
      test.skip(true, 'No questions available for practice');
      return;
    }

    await startBtn.click();

    // Answer all questions until finished
    let finished = false;
    for (let i = 0; i < 25; i++) {
      // Check if we're on result page
      if (await page.getByText('Chi tiết').isVisible().catch(() => false)) {
        finished = true;
        break;
      }

      // Select first answer option
      const options = page.locator('button[class*="option"], [data-testid="option-button"]').or(
        page.locator('.space-y-2 button, .grid button').first()
      );
      const firstOption = options.first();

      if (await firstOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstOption.click();

        // Wait for feedback then click continue/result
        const continueBtn = page.getByRole('button', { name: /Tiếp tục|Xem kết quả/i });
        if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await continueBtn.click();
        }
      } else {
        break;
      }
    }

    // Should eventually reach the result page
    await expect(page.getByText('Chi tiết').or(page.getByText(/\/\d+/))).toBeVisible({
      timeout: 15000,
    });
  });
});
