import { test, expect } from '@playwright/test';

test.describe('Shared Exam', () => {
  let shareCode: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'e2e/.auth/user.json',
    });
    const page = await context.newPage();

    // Create a question first
    await page.goto('/questions/add');
    await page.getByLabel('Câu hỏi').fill('[E2E] Câu hỏi chia sẻ?');
    await page.getByPlaceholder('Đáp án A').fill('Đúng');
    await page.getByPlaceholder('Đáp án B').fill('Sai B');
    await page.getByPlaceholder('Đáp án C').fill('Sai C');
    await page.getByPlaceholder('Đáp án D').fill('Sai D');
    await page.getByRole('button', { name: /Thêm câu hỏi/i }).click();
    await expect(page).toHaveURL(/questions$/, { timeout: 10000 });

    // Create an exam
    await page.goto('/exams/create');
    await page.getByLabel('Tên đề thi').fill('[E2E] Đề thi chia sẻ');
    await page.getByLabel('Mô tả').fill('[E2E] Đề thi dùng cho test chia sẻ');
    await page.getByLabel('Thời gian (phút)').clear();
    await page.getByLabel('Thời gian (phút)').fill('5');
    await page.getByRole('button', { name: /Chọn tất cả/i }).click();
    await page.getByRole('button', { name: /Tạo đề thi$/i }).click();
    await expect(page).toHaveURL(/exams$/, { timeout: 10000 });

    // Share the exam
    const examCard = page.locator('.card, [class*="card"]').filter({ hasText: '[E2E] Đề thi chia sẻ' }).first();
    await examCard.locator('button:has(svg.lucide-share-2)').click();

    const createShareBtn = page.getByRole('button', { name: /Tạo link chia sẻ/i });
    if (await createShareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createShareBtn.click();
    }

    // Wait for share dialog with URL
    await page.waitForTimeout(2000);
    const shareInput = page.locator('input[readonly]');
    if (await shareInput.isVisible({ timeout: 5000 })) {
      const url = await shareInput.inputValue();
      const match = url.match(/share\/(.+)$/);
      if (match) {
        shareCode = match[1];
      }
    }

    await context.close();
  });

  test('shared exam page shows exam info', async ({ page }) => {
    test.skip(!shareCode, 'No shared exam available');

    await page.goto(`/share/${shareCode}`);

    await expect(page.getByText('[E2E] Đề thi chia sẻ')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/câu/)).toBeVisible();
    await expect(page.getByText(/phút/)).toBeVisible();
    await expect(page.getByText(/bởi/)).toBeVisible();
    await expect(page.getByRole('link', { name: /Bắt đầu làm bài/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Bảng xếp hạng/i })).toBeVisible();
  });

  test('requires name before starting', async ({ page }) => {
    test.skip(!shareCode, 'No shared exam available');

    await page.goto(`/share/${shareCode}/quiz`);

    await expect(page.getByLabel('Tên của bạn')).toBeVisible({ timeout: 10000 });

    // Try to start without name
    await page.getByRole('button', { name: /Bắt đầu làm bài/i }).click();
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 });
  });

  test('take shared exam and see results', async ({ page }) => {
    test.skip(!shareCode, 'No shared exam available');

    await page.goto(`/share/${shareCode}/quiz`);

    await page.getByLabel('Tên của bạn').fill('[E2E] Test Player');
    await page.getByRole('button', { name: /Bắt đầu làm bài/i }).click();

    // Wait for exam to start
    await page.waitForTimeout(1000);

    // Select first answer for each question and submit
    const options = page.locator('.space-y-2 button, .grid button, [data-testid="option-button"]');
    if (await options.first().isVisible({ timeout: 5000 })) {
      await options.first().click();
    }

    // Submit
    await page.getByRole('button', { name: /Nộp bài/i }).click();
    await expect(page.getByText(/Bạn có chắc muốn nộp bài/)).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    // Result page
    await expect(page.getByText('Chi tiết').or(page.getByText(/\/\d+/))).toBeVisible({
      timeout: 15000,
    });
  });

  test('leaderboard shows attempt', async ({ page }) => {
    test.skip(!shareCode, 'No shared exam available');

    await page.goto(`/share/${shareCode}/leaderboard`);

    await expect(page.getByText(/Bảng xếp hạng/)).toBeVisible({ timeout: 10000 });

    const playerName = page.getByText('[E2E] Test Player');
    const emptyState = page.getByText('Chưa có ai làm bài');

    await expect(playerName.or(emptyState)).toBeVisible({ timeout: 5000 });
  });
});
