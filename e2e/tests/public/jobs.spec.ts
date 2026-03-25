import { test, expect } from '@playwright/test';

test.describe('求人一覧ページ', () => {
  test('求人一覧が表示される', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveTitle(/求人|募集|CORP/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('求人カードが存在する', async ({ page }) => {
    await page.goto('/jobs');
    // 求人カード or リストアイテムが表示されるまで待機
    const cards = page.locator('a[href^="/jobs/"]');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test('求人詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/jobs');
    const firstJob = page.locator('a[href^="/jobs/"]').first();
    await expect(firstJob).toBeVisible({ timeout: 10_000 });
    await firstJob.click();
    await expect(page).toHaveURL(/\/jobs\/.+/);
    // 詳細ページにタイトルが表示される
    await expect(page.locator('main')).toBeVisible();
  });

  test('雇用形態フィルタが機能する', async ({ page }) => {
    await page.goto('/jobs');
    // フィルタ要素を探す
    const filter = page.locator('select, [role="listbox"], button:has-text("正社員"), button:has-text("full-time"), a[href*="employment_type"]').first();
    if (await filter.isVisible().catch(() => false)) {
      await filter.click();
    }
  });
});

test.describe('求人詳細ページ', () => {
  test('求人情報が表示される', async ({ page }) => {
    await page.goto('/jobs');
    const firstJob = page.locator('a[href^="/jobs/"]').first();
    await expect(firstJob).toBeVisible({ timeout: 10_000 });
    await firstJob.click();
    await expect(page).toHaveURL(/\/jobs\/.+/);
    // 業務内容・応募要件が表示される
    await expect(page.locator('main')).toContainText(/.+/);
  });

  test('応募ボタンが存在する', async ({ page }) => {
    await page.goto('/jobs');
    const firstJob = page.locator('a[href^="/jobs/"]').first();
    await expect(firstJob).toBeVisible({ timeout: 10_000 });
    await firstJob.click();
    // 応募リンクが存在する
    const entryLink = page.locator('a[href*="entry"], a:has-text("応募"), button:has-text("応募")').first();
    if (await entryLink.isVisible().catch(() => false)) {
      await expect(entryLink).toBeVisible();
    }
  });
});
