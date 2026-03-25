import { test, expect } from '@playwright/test';

test.describe('求人検索 → 詳細閲覧フロー', () => {
  test('トップ → 求人一覧 → フィルタ → 詳細 → 応募ページへ遷移', async ({ page }) => {
    // 1. トップページ表示
    await page.goto('/');
    await expect(page).toHaveTitle(/CORP/);

    // 2. 求人一覧へ遷移
    const jobsLink = page.locator('a[href="/jobs"]').first();
    await expect(jobsLink).toBeVisible();
    await jobsLink.click();
    await expect(page).toHaveURL(/\/jobs/);

    // 3. 求人カードが表示されるのを待つ
    const jobCards = page.locator('a[href^="/jobs/"]');
    await expect(jobCards.first()).toBeVisible({ timeout: 15_000 });
    const initialCount = await jobCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // 4. 雇用形態フィルタが存在すれば使用
    const filterBtn = page.locator('button:has-text("正社員")');
    if (await filterBtn.isVisible().catch(() => false)) {
      await filterBtn.click();
      await page.waitForURL(/employment_type/);
      // フィルタ後もカードが表示される（または空状態）
      await page.waitForTimeout(1_000);
    }

    // 5. フィルタをリセット（「すべて」をクリック）
    const allBtn = page.locator('button:has-text("すべて")');
    if (await allBtn.isVisible().catch(() => false)) {
      await allBtn.click();
      await page.waitForTimeout(1_000);
    }

    // 6. 最初の求人詳細へ遷移
    await page.goto('/jobs');
    const firstJob = page.locator('a[href^="/jobs/"]').first();
    await expect(firstJob).toBeVisible({ timeout: 15_000 });
    const jobTitle = await firstJob.locator('h2, h3').first().textContent();
    await firstJob.click();
    await expect(page).toHaveURL(/\/jobs\/.+/);

    // 7. 詳細ページの内容を検証
    await expect(page.locator('main')).toContainText(jobTitle || '');

    // 8. 応募リンクへ遷移できることを確認
    const entryLink = page.locator('a[href*="entry"], a:has-text("応募")').first();
    if (await entryLink.isVisible().catch(() => false)) {
      await entryLink.click();
      await expect(page).toHaveURL(/\/entry/);
    }
  });
});

test.describe('応募フォーム ステップフロー', () => {
  test('入力 → 確認画面 → 戻って修正 の流れ', async ({ page }) => {
    await page.goto('/entry');
    await expect(page.locator('main')).toBeVisible();

    const form = page.locator('form');
    await expect(form).toBeVisible({ timeout: 10_000 });

    // Step 1: 入力
    const nameInput = form.locator('input[name="name"]');
    await nameInput.fill('テスト太郎');

    const emailInput = form.locator('input[name="email"]');
    await emailInput.fill('test-e2e@example.com');

    const phoneInput = form.locator('input[name="phone"]');
    await phoneInput.fill('090-1234-5678');

    const ageInput = form.locator('input[name="age"]');
    if (await ageInput.isVisible().catch(() => false)) {
      await ageInput.fill('28');
    }

    const messageArea = form.locator('textarea[name="message"]');
    if (await messageArea.isVisible().catch(() => false)) {
      await messageArea.fill('E2Eテスト用のメッセージです。');
    }

    // 確認画面へ
    const confirmBtn = page.locator('button:has-text("確認画面へ")');
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();

      // Step 2: 確認画面で入力内容が表示される
      await expect(page.locator('text=テスト太郎')).toBeVisible({ timeout: 5_000 });
      await expect(page.locator('text=test-e2e@example.com')).toBeVisible();

      // Step 3: 戻って修正
      const backBtn = page.locator('button:has-text("戻って修正")');
      await expect(backBtn).toBeVisible();
      await backBtn.click();

      // 入力値が保持されている
      await expect(nameInput).toHaveValue('テスト太郎');
      await expect(emailInput).toHaveValue('test-e2e@example.com');
    }
  });
});

test.describe('お問い合わせフォーム フロー', () => {
  test('フォーム入力 → バリデーション確認', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // 空送信でバリデーション
    const submitBtn = form.locator('button[type="submit"]');
    await submitBtn.click();
    const nameInput = form.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(isInvalid).toBe(true);

    // 必須フィールドを入力
    await nameInput.fill('テスト花子');
    await form.locator('input[name="email"]').fill('contact-test@example.com');

    const companyInput = form.locator('input[name="company"]');
    if (await companyInput.isVisible().catch(() => false)) {
      await companyInput.fill('テスト株式会社');
    }

    await form.locator('textarea[name="message"]').fill('E2Eテスト お問い合わせ内容');

    // 入力値が反映されていることを確認
    await expect(nameInput).toHaveValue('テスト花子');
    await expect(form.locator('textarea[name="message"]')).toHaveValue('E2Eテスト お問い合わせ内容');
  });
});

test.describe('ナビゲーション全体フロー', () => {
  test('ヘッダーから各ページへ遷移して戻る', async ({ page }) => {
    await page.goto('/');

    // 主要ナビリンクを順に確認
    const navLinks = [
      { href: '/jobs', keyword: '募集' },
      { href: '/members', keyword: '社員' },
      { href: '/news', keyword: 'お知らせ' },
    ];

    for (const { href, keyword } of navLinks) {
      const link = page.locator(`header a[href="${href}"]`).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(new RegExp(href));
        await expect(page.locator('main')).toContainText(new RegExp(keyword, 'i'));
      }
    }

    // トップへ戻る
    const homeLink = page.locator('header a[href="/"]').first();
    if (await homeLink.isVisible().catch(() => false)) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('レスポンシブ: モバイルメニューが動作する', async ({ page }) => {
    // モバイルビューポート
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // ハンバーガーメニューボタン
    const menuBtn = page.locator('button[aria-label*="メニュー"], header button').first();
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click();
      // メニューが展開される
      await page.waitForTimeout(500);
      const mobileNav = page.locator('a[href="/jobs"]').first();
      await expect(mobileNav).toBeVisible({ timeout: 5_000 });
    }
  });
});
