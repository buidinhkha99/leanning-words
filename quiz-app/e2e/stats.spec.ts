import { test, expect } from '@playwright/test';

test.describe('Statistics', () => {
  test('displays stat cards', async ({ page }) => {
    await page.goto('/stats');

    await expect(page.getByText('Thống kê')).toBeVisible({ timeout: 10000 });

    // Stat cards
    await expect(page.getByText('Tổng lượt làm bài')).toBeVisible();
    await expect(page.getByText('Điểm trung bình')).toBeVisible();
    await expect(page.getByText('Câu trả lời đúng')).toBeVisible();
  });

  test('charts are rendered', async ({ page }) => {
    await page.goto('/stats');

    await expect(page.getByText('Thống kê')).toBeVisible({ timeout: 10000 });

    // Chart section titles
    await expect(page.getByText('Điểm theo thời gian')).toBeVisible();
    await expect(page.getByText('Tỉ lệ đúng / sai')).toBeVisible();

    // At least the chart containers should exist
    await expect(page.locator('.card, [class*="card"]')).toHaveCount(5, { timeout: 5000 });
  });
});
