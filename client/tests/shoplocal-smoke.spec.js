import { test, expect } from '@playwright/test';

test('Shop Local home page loads', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await expect(page).toHaveURL(/localhost:3001/);
});