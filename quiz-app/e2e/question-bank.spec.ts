import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Question Bank', () => {
  test('add a new question', async ({ page }) => {
    await page.goto('/questions/add');

    await page.getByLabel('Câu hỏi').fill('[E2E] Thủ đô Việt Nam là gì?');
    await page.getByPlaceholder('Đáp án A').fill('Hà Nội');
    await page.getByPlaceholder('Đáp án B').fill('Hồ Chí Minh');
    await page.getByPlaceholder('Đáp án C').fill('Đà Nẵng');
    await page.getByPlaceholder('Đáp án D').fill('Huế');
    // Select correct answer A (index 0) - it should be default
    await page.getByRole('button', { name: /Thêm câu hỏi/i }).click();

    // Should show toast and redirect
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/questions$/);
    await expect(page.getByText('[E2E] Thủ đô Việt Nam là gì?')).toBeVisible();
  });

  test('edit a question', async ({ page }) => {
    await page.goto('/questions');

    // Wait for questions to load
    await expect(page.getByText('[E2E]')).toBeVisible({ timeout: 10000 });

    // Click edit on the first [E2E] question
    const questionCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E]' }).first();
    await questionCard.locator('a[href*="/sua/"]').click();

    await expect(page.getByLabel('Câu hỏi')).toBeVisible({ timeout: 5000 });

    // Update the question text
    await page.getByLabel('Câu hỏi').clear();
    await page.getByLabel('Câu hỏi').fill('[E2E] Câu hỏi đã cập nhật?');
    await page.getByRole('button', { name: /Cập nhật/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/questions$/);
    await expect(page.getByText('[E2E] Câu hỏi đã cập nhật?')).toBeVisible();
  });

  test('delete a question', async ({ page }) => {
    await page.goto('/questions');

    await expect(page.getByText('[E2E]')).toBeVisible({ timeout: 10000 });

    // Click delete button on [E2E] question
    const questionCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E]' }).first();
    await questionCard.locator('button.text-destructive, button:has(svg.lucide-trash-2)').click();

    // Confirm dialog
    await expect(page.getByText('Bạn có chắc muốn xoá câu hỏi này?')).toBeVisible();
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('shows empty state when no questions', async ({ page }) => {
    await page.goto('/questions');

    const emptyMsg = page.getByText('Chưa có câu hỏi nào');
    const questionList = page.getByText(/Câu \d+:/);

    await expect(emptyMsg.or(questionList.first())).toBeVisible({ timeout: 10000 });
  });

  test('import CSV file', async ({ page }) => {
    await page.goto('/questions/import');

    const csvPath = path.resolve(__dirname, 'fixtures/import-sample.csv');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    // Should show preview table
    await expect(page.getByText('[E2E] Cau hoi CSV 1?')).toBeVisible({ timeout: 5000 });

    // Click import
    const importBtn = page.getByRole('button', { name: /import/i }).first();
    await importBtn.click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('import JSON file', async ({ page }) => {
    await page.goto('/questions/import');

    const jsonPath = path.resolve(__dirname, 'fixtures/import-sample.json');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(jsonPath);

    await expect(page.getByText('[E2E] Cau hoi JSON 1?')).toBeVisible({ timeout: 5000 });

    const importBtn = page.getByRole('button', { name: /import/i }).first();
    await importBtn.click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('download template', async ({ page }) => {
    await page.goto('/questions/import');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Tải template/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('template');
  });
});
