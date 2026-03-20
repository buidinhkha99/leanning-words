import { test, expect } from '@playwright/test';

test.describe('Exam CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we have at least one question to create an exam
    await page.goto('/questions/add');
    await page.getByLabel('Câu hỏi').fill('[E2E] Câu hỏi cho đề thi?');
    await page.getByPlaceholder('Đáp án A').fill('A');
    await page.getByPlaceholder('Đáp án B').fill('B');
    await page.getByPlaceholder('Đáp án C').fill('C');
    await page.getByPlaceholder('Đáp án D').fill('D');
    await page.getByRole('button', { name: /Thêm câu hỏi/i }).click();
    await expect(page).toHaveURL(/questions$/, { timeout: 10000 });
  });

  test('create an exam', async ({ page }) => {
    await page.goto('/exams/create');

    await page.getByLabel('Tên đề thi').fill('[E2E] Đề thi thử');
    await page.getByLabel('Mô tả').fill('[E2E] Mô tả đề thi test');
    await page.getByLabel('Thời gian (phút)').clear();
    await page.getByLabel('Thời gian (phút)').fill('5');

    // Select all questions
    await page.getByRole('button', { name: /Chọn tất cả/i }).click();

    await page.getByRole('button', { name: /Tạo đề thi$/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/exams$/, { timeout: 10000 });
    await expect(page.getByText('[E2E] Đề thi thử')).toBeVisible();
  });

  test('edit an exam', async ({ page }) => {
    await page.goto('/exams');

    await expect(page.getByText('[E2E]')).toBeVisible({ timeout: 10000 });

    // Click edit button on [E2E] exam
    const examCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E]' }).first();
    await examCard.locator('a[href*="/sua/"]').click();

    await expect(page.getByLabel('Tên đề thi')).toBeVisible({ timeout: 5000 });
    await page.getByLabel('Tên đề thi').clear();
    await page.getByLabel('Tên đề thi').fill('[E2E] Đề thi đã sửa');
    await page.getByRole('button', { name: /Cập nhật|Lưu/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('share and unshare an exam', async ({ page }) => {
    await page.goto('/exams');

    await expect(page.getByText('[E2E]')).toBeVisible({ timeout: 10000 });

    // Click share button
    const examCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E]' }).first();
    await examCard.locator('button:has(svg.lucide-share-2)').click();

    // Wait for share dialog or share action
    const createShareBtn = page.getByRole('button', { name: /Tạo link chia sẻ/i });
    if (await createShareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createShareBtn.click();
    }

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });

    // Dialog should show the share URL and copy button
    await expect(page.getByRole('button', { name: /copy/i }).or(page.locator('button:has(svg.lucide-copy)'))).toBeVisible({ timeout: 5000 });

    // Unshare
    await page.getByRole('button', { name: /Huỷ chia sẻ/i }).click();
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('delete an exam', async ({ page }) => {
    await page.goto('/exams');

    await expect(page.getByText('[E2E]')).toBeVisible({ timeout: 10000 });

    const examCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E]' }).first();
    await examCard.locator('button:has(svg.lucide-trash-2), button.text-destructive').click();

    await expect(page.getByText('Bạn có chắc muốn xoá đề thi này?')).toBeVisible();
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});
