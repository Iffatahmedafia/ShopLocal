import { test, expect } from '@playwright/test';

test('user can open login page and submit login form', async ({ page }) => {
  await page.goto('http://localhost:3001/login');

  await page.locator('input[type="email"]').fill('test@gmail.com');
  await page.locator('input[type="password"]').fill('test123');

  await page.locator('button[type="submit"]').click();

  await page.waitForTimeout(3000);

  await expect(page).not.toHaveURL(/login/);
});