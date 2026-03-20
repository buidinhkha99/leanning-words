import { test, expect } from '@playwright/test';

test.describe('Visual Regression @visual', () => {
  // Auth pages (use no-auth state)
  test.describe('Auth pages', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login.png', { fullPage: true });
    });

    test('register page', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('register.png', { fullPage: true });
    });
  });

  // Authenticated pages
  test.describe('Main pages', () => {
    test('dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      // Wait for skeleton to disappear and content to load
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true });
    });

    test('question bank', async ({ page }) => {
      await page.goto('/questions');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('question-bank.png', { fullPage: true });
    });

    test('add question', async ({ page }) => {
      await page.goto('/questions/add');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('add-question.png', { fullPage: true });
    });

    test('import questions', async ({ page }) => {
      await page.goto('/questions/import');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('import-questions.png', { fullPage: true });
    });

    test('exam list', async ({ page }) => {
      await page.goto('/exams');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('exam-list.png', { fullPage: true });
    });

    test('create exam', async ({ page }) => {
      await page.goto('/exams/create');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('create-exam.png', { fullPage: true });
    });

    test('practice page', async ({ page }) => {
      await page.goto('/practice');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('practice.png', { fullPage: true });
    });

    test('history page', async ({ page }) => {
      await page.goto('/history');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('history.png', { fullPage: true });
    });

    test('stats page', async ({ page }) => {
      await page.goto('/stats');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('stats.png', { fullPage: true });
    });
  });
});
