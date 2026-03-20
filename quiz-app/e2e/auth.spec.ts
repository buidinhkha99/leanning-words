import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth for this suite

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /Đăng nhập/i })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu')).toBeVisible();
    await expect(page.getByRole('button', { name: /Đăng nhập$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Đăng ký/i })).toBeVisible();
  });

  test('login with email/password redirects to /dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Mật khẩu').fill(TEST_USER.password);
    await page.getByRole('button', { name: /Đăng nhập$/i }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  });

  test('login with wrong password shows error toast', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Mật khẩu').fill('WrongPassword123');
    await page.getByRole('button', { name: /Đăng nhập$/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /Đăng ký/i })).toBeVisible();
    await expect(page.getByLabel('Tên hiển thị')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu')).toBeVisible();
    await expect(page.getByRole('button', { name: /Đăng ký$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Đăng nhập/i })).toBeVisible();
  });

  test('accessing /dashboard without login redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/login/, { timeout: 15000 });
  });
});

test.describe('Logout', () => {
  test('logout redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Open dropdown and click logout
    await page.getByRole('button', { name: /user|account/i }).or(page.locator('[data-testid="user-menu"]')).or(page.locator('button:has(svg.lucide-user)')).first().click();
    await page.getByText('Đăng xuất').click();

    await expect(page).toHaveURL(/login/, { timeout: 15000 });
  });
});
