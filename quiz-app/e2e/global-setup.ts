import { test as setup, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(TEST_USER.email);
  await page.getByLabel('Mật khẩu').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 });

  // Save signed-in state
  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
