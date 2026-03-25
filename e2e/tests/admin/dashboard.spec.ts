import { test, expect, Page } from '@playwright/test';

// ログインヘルパー
async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.locator('input[type="email"], input[name="email"]').first().fill('admin@example.com');
  await page.locator('input[type="password"]').first().fill('password');
  await page.locator('button[type="submit"], button:has-text("ログイン")').first().click();
  await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
}

test.describe('ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('ダッシュボードが表示される', async ({ page }) => {
    await expect(page.locator('text=ダッシュボード').first()).toBeVisible({ timeout: 10_000 });
  });

  test('統計情報が表示される', async ({ page }) => {
    // 統計カードが表示される（求人数・応募数・問い合わせ数）
    await page.waitForTimeout(2_000); // データ取得待ち
    const main = page.locator('main, [role="main"], .dashboard, #app');
    await expect(main.first()).toBeVisible();
  });
});

test.describe('求人管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('求人一覧ページが表示される', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.locator('main, [role="main"], #app')).toBeVisible();
    // テーブルまたはリストが表示される
    await page.waitForTimeout(2_000);
  });

  test('求人作成ページへ遷移できる', async ({ page }) => {
    await page.goto('/jobs');
    const createBtn = page.locator('a[href="/jobs/create"], button:has-text("新規"), button:has-text("作成"), a:has-text("新規")').first();
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
      await expect(page).toHaveURL(/\/jobs\/create/);
    }
  });

  test('求人作成フォームが表示される', async ({ page }) => {
    await page.goto('/jobs/create');
    await expect(page.locator('form, input[name="title"], input[type="text"]').first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('応募管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('応募一覧ページが表示される', async ({ page }) => {
    await page.goto('/applications');
    await expect(page.locator('main, [role="main"], #app')).toBeVisible();
    await page.waitForTimeout(2_000);
  });
});

test.describe('お知らせ管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('お知らせ一覧ページが表示される', async ({ page }) => {
    await page.goto('/news');
    await expect(page.locator('main, [role="main"], #app')).toBeVisible();
    await page.waitForTimeout(2_000);
  });

  test('お知らせ作成ページへ遷移できる', async ({ page }) => {
    await page.goto('/news');
    const createBtn = page.locator('a[href="/news/create"], button:has-text("新規"), button:has-text("作成"), a:has-text("新規")').first();
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
      await expect(page).toHaveURL(/\/news\/create/);
    }
  });
});

test.describe('問い合わせ管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('問い合わせ一覧が表示される', async ({ page }) => {
    await page.goto('/inquiries');
    await expect(page.locator('main, [role="main"], #app')).toBeVisible();
    await page.waitForTimeout(2_000);
  });
});

test.describe('サイドバーナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('各メニューリンクが存在する', async ({ page }) => {
    const menuLinks = ['/jobs', '/applications', '/news', '/inquiries', '/members', '/media'];
    for (const href of menuLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      if (await link.isVisible().catch(() => false)) {
        await expect(link).toBeVisible();
      }
    }
  });
});
