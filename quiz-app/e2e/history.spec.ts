import { test, expect } from '@playwright/test';

test.describe('History', () => {
  test('shows tabs with practice and exam counts', async ({ page }) => {
    await page.goto('/history');

    await expect(page.getByText('Lịch sử làm bài')).toBeVisible({ timeout: 10000 });

    // Tabs should be visible
    await expect(page.getByRole('tab', { name: /Ôn tập/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Thi/ })).toBeVisible();

    // Tab text includes count
    await expect(page.getByText(/Ôn tập \(\d+\)/)).toBeVisible();
    await expect(page.getByText(/Thi \(\d+\)/)).toBeVisible();
  });

  test('click on history entry navigates to detail page', async ({ page }) => {
    await page.goto('/history');

    await expect(page.getByText('Lịch sử làm bài')).toBeVisible({ timeout: 10000 });

    const historyLink = page.locator('a[href*="/history/"]').first();
    if (!(await historyLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.getByRole('tab', { name: /Thi/ }).click();
      const examLink = page.locator('a[href*="/history/"]').first();
      if (!(await examLink.isVisible({ timeout: 3000 }).catch(() => false))) {
        test.skip(true, 'No history entries available');
        return;
      }
      await examLink.click();
    } else {
      await historyLink.click();
    }

    await expect(page.getByText(/\/\d+/).or(page.getByText('Chi tiết'))).toBeVisible({
      timeout: 10000,
    });
  });
});
