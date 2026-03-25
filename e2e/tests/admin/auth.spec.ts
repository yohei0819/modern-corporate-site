import { test, expect } from '@playwright/test';

test.describe('管理画面ログイン', () => {
  test('ログインページが表示される', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('空欄でログインするとエラーになる', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"], button:has-text("ログイン")').first();
    await submitBtn.click();

    // HTML5 バリデーションが発火する
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test('不正な認証情報でエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"], input[name="email"]').first().fill('wrong@example.com');
    await page.locator('input[type="password"]').first().fill('wrongpassword');

    const submitBtn = page.locator('button[type="submit"], button:has-text("ログイン")').first();
    await submitBtn.click();

    // エラーメッセージが表示されるまで待機
    const errorMsg = page.locator('text=メールアドレスまたはパスワードが正しくありません');
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test('正しい認証情報でログインできる', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"], input[name="email"]').first().fill('admin@example.com');
    await page.locator('input[type="password"]').first().fill('password');

    const submitBtn = page.locator('button[type="submit"], button:has-text("ログイン")').first();
    await submitBtn.click();

    // ダッシュボードへリダイレクトされる
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
  });
});

test.describe('未認証アクセス', () => {
  test('ダッシュボードにアクセスするとログインへリダイレクト', async ({ page }) => {
    await page.goto('/');
    // 未認証の場合はログイン画面にリダイレクトされる
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('求人管理にアクセスするとログインへリダイレクト', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
