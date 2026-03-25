import { test, expect } from '@playwright/test';

test.describe('社員紹介ページ', () => {
  test('社員一覧が表示される', async ({ page }) => {
    await page.goto('/members');
    await expect(page.locator('main')).toBeVisible();
  });

  test('社員カードが表示される', async ({ page }) => {
    await page.goto('/members');
    const cards = page.locator('a[href^="/members/"]');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test('社員詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/members');
    const firstMember = page.locator('a[href^="/members/"]').first();
    await expect(firstMember).toBeVisible({ timeout: 10_000 });
    await firstMember.click();
    await expect(page).toHaveURL(/\/members\/.+/);
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('お知らせページ', () => {
  test('お知らせ一覧が表示される', async ({ page }) => {
    await page.goto('/news');
    await expect(page.locator('main')).toBeVisible();
  });

  test('お知らせ記事が表示される', async ({ page }) => {
    await page.goto('/news');
    const articles = page.locator('a[href^="/news/"]');
    await expect(articles.first()).toBeVisible({ timeout: 10_000 });
  });

  test('お知らせ詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/news');
    const firstArticle = page.locator('a[href^="/news/"]').first();
    await expect(firstArticle).toBeVisible({ timeout: 10_000 });
    await firstArticle.click();
    await expect(page).toHaveURL(/\/news\/.+/);
    await expect(page.locator('main')).toBeVisible();
  });
});
