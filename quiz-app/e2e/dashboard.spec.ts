import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('displays stat cards', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Trang chủ' })).toBeVisible({ timeout: 10000 });

    // Stat cards with labels
    await expect(page.getByText('Câu hỏi trong ngân hàng')).toBeVisible();
    await expect(page.getByText('Đề thi')).toBeVisible();
    await expect(page.getByText('Tổng số lượt làm bài')).toBeVisible();
    await expect(page.getByText('Điểm trung bình')).toBeVisible();
  });

  test('click "Quản lý" link navigates to question bank', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Câu hỏi trong ngân hàng')).toBeVisible({ timeout: 10000 });

    // Click the first "Quản lý" link (question bank)
    await page.getByRole('link', { name: 'Quản lý' }).first().click();

    await expect(page).toHaveURL(/questions/);
  });
});
