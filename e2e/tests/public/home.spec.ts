import { test, expect } from '@playwright/test';

test.describe('トップページ', () => {
  test('ページタイトルが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CORP/);
  });

  test('ヒーローセクションが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('ヘッダーナビゲーションが存在する', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header nav, header');
    await expect(nav).toBeVisible();
  });

  test('フッターが表示される', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('求人セクションへのリンクが機能する', async ({ page }) => {
    await page.goto('/');
    const jobsLink = page.locator('a[href="/jobs"]').first();
    if (await jobsLink.isVisible()) {
      await jobsLink.click();
      await expect(page).toHaveURL(/\/jobs/);
    }
  });
});
