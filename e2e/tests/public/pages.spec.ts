import { test, expect } from '@playwright/test';

test.describe('静的ページ', () => {
  const pages = [
    { path: '/about', text: '会社' },
    { path: '/business', text: '事業' },
    { path: '/culture', text: '環境' },
    { path: '/faq', text: 'FAQ' },
    { path: '/privacy', text: 'プライバシー' },
  ];

  for (const { path, text } of pages) {
    test(`${path} が表示される`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main')).toContainText(new RegExp(text, 'i'));
    });
  }
});

test.describe('問い合わせフォーム', () => {
  test('フォームが表示される', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });

  test('空送信でバリデーションエラーが出る', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // 送信ボタンをクリック
    const submitBtn = form.locator('button[type="submit"]');
    await submitBtn.click();

    // HTML5 バリデーション or カスタムエラー表示
    // required 属性があるかフォームのバリデーション状態を確認
    const nameInput = form.locator('input[name="name"], input[type="text"]').first();
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test('フォーム入力ができる', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // 名前フィールド
    const nameInput = form.locator('input[name="name"], input[placeholder*="名前"], input[type="text"]').first();
    await nameInput.fill('テスト太郎');
    await expect(nameInput).toHaveValue('テスト太郎');

    // メールフィールド
    const emailInput = form.locator('input[name="email"], input[type="email"]').first();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });
});

test.describe('応募フォーム', () => {
  test('フォームが表示される', async ({ page }) => {
    await page.goto('/entry');
    await expect(page.locator('main')).toBeVisible();
  });

  test('フォーム要素が存在する', async ({ page }) => {
    await page.goto('/entry');
    // フォーム or 入力フィールドが表示される
    const formArea = page.locator('form, [role="form"], input[type="text"], input[name="name"]').first();
    await expect(formArea).toBeVisible({ timeout: 10_000 });
  });
});
