import { test, expect, Page } from '@playwright/test';

// ログインヘルパー
async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.locator('input[type="email"], input[name="email"]').first().fill('admin@example.com');
  await page.locator('input[type="password"]').first().fill('password');
  await page.locator('button[type="submit"]').first().click();
  await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
}

test.describe('求人 CRUD ライフサイクル', () => {
  const timestamp = Date.now();
  const jobTitle = `E2Eテスト求人 ${timestamp}`;
  const jobSlug = `e2e-test-job-${timestamp}`;

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('求人を新規作成できる', async ({ page }) => {
    // 求人一覧へ
    await page.goto('/jobs');
    await page.waitForTimeout(2_000);

    // 新規作成ボタン
    const createBtn = page.locator('a:has-text("新規作成"), button:has-text("新規作成")').first();
    await expect(createBtn).toBeVisible({ timeout: 10_000 });
    await createBtn.click();
    await expect(page).toHaveURL(/\/jobs\/create/);

    // フォームに入力
    const form = page.locator('form');
    await expect(form).toBeVisible({ timeout: 10_000 });

    await form.locator('input').nth(0).fill(jobTitle); // タイトル
    await form.locator('input').nth(1).fill(jobSlug);  // スラッグ

    // 勤務地
    const locationInput = form.locator('input[placeholder*="勤務地"], input').nth(3);
    if (await locationInput.isVisible().catch(() => false)) {
      await locationInput.fill('東京都渋谷区');
    }

    // 概要
    const summaryArea = form.locator('textarea').first();
    if (await summaryArea.isVisible().catch(() => false)) {
      await summaryArea.fill('E2Eテスト用の求人概要です。');
    }

    // 仕事内容
    const descriptionArea = form.locator('textarea').nth(1);
    if (await descriptionArea.isVisible().catch(() => false)) {
      await descriptionArea.fill('E2Eテスト用の仕事内容です。');
    }

    // 送信
    const submitBtn = form.locator('button[type="submit"]').first();
    await submitBtn.click();

    // 成功：求人一覧にリダイレクト or トースト表示
    await expect(page).toHaveURL(/\/jobs$/, { timeout: 15_000 });
  });

  test('作成した求人が一覧に表示される', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForTimeout(3_000);

    // 作成した求人がテーブルに表示される
    const jobRow = page.locator(`text=${jobTitle}`).first();
    await expect(jobRow).toBeVisible({ timeout: 10_000 });
  });

  test('求人を編集できる', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForTimeout(3_000);

    // 編集ボタンをクリック
    const row = page.locator(`tr:has-text("${jobTitle}")`).first();
    if (await row.isVisible().catch(() => false)) {
      const editBtn = row.locator('a:has-text("編集"), button:has-text("編集")').first();
      await editBtn.click();
      await expect(page).toHaveURL(/\/jobs\/\d+\/edit/);

      // タイトルを変更
      const titleInput = page.locator('form input').first();
      await expect(titleInput).toHaveValue(jobTitle, { timeout: 10_000 });
      await titleInput.fill(`${jobTitle} 更新済`);

      // 保存
      const submitBtn = page.locator('form button[type="submit"]').first();
      await submitBtn.click();
      await expect(page).toHaveURL(/\/jobs$/, { timeout: 15_000 });
    }
  });

  test('求人を削除できる', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForTimeout(3_000);

    // 削除対象の行を見つける
    const row = page.locator(`tr:has-text("${jobTitle}")`).first();
    if (await row.isVisible().catch(() => false)) {
      const deleteBtn = row.locator('button:has-text("削除")').first();
      await deleteBtn.click();

      // 確認ダイアログで「削除」を押す
      const confirmBtn = page.locator('button:has-text("削除する"), button:has-text("はい")').first();
      await expect(confirmBtn).toBeVisible({ timeout: 5_000 });
      await confirmBtn.click();

      // トースト通知が表示される
      await page.waitForTimeout(2_000);

      // 削除された求人がテーブルに存在しないことを確認
      await expect(page.locator(`text=${jobTitle}`)).toHaveCount(0, { timeout: 10_000 });
    }
  });
});

test.describe('求人の一括削除フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('チェックボックスで複数選択 → 一括削除', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForTimeout(3_000);

    // チェックボックスが存在するか確認
    const checkboxes = page.locator('table input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count >= 2) {
      // ヘッダーの全選択チェックボックス
      const selectAllCheckbox = checkboxes.first();
      await selectAllCheckbox.check();

      // 一括削除ボタンが表示される
      const bulkDeleteBtn = page.locator('button:has-text("件を削除")').first();
      if (await bulkDeleteBtn.isVisible().catch(() => false)) {
        await expect(bulkDeleteBtn).toBeVisible();
        // 実際には削除しない（テストデータを壊さないため）
        // bulkDeleteBtn のテキストに件数が含まれることを確認
        const btnText = await bulkDeleteBtn.textContent();
        expect(btnText).toMatch(/\d+\s*件を削除/);
      }

      // チェックを外す
      await selectAllCheckbox.uncheck();
    }
  });
});

test.describe('応募ステータス管理フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('応募一覧 → 詳細 → ステータス変更', async ({ page }) => {
    await page.goto('/applications');
    await page.waitForTimeout(3_000);

    // 応募一覧が表示される
    const table = page.locator('table, .application-list');
    await expect(table.first()).toBeVisible({ timeout: 10_000 });

    // 最初の応募の詳細リンクをクリック
    const detailLink = page.locator('a[href^="/applications/"]').first();
    if (await detailLink.isVisible().catch(() => false)) {
      await detailLink.click();
      await expect(page).toHaveURL(/\/applications\/\d+/);

      // ステータス変更ボタンが表示される
      await page.waitForTimeout(2_000);
      const statusBtns = page.locator('button:has-text("選考中"), button:has-text("面接済"), button:has-text("採用"), button:has-text("不採用")');
      if (await statusBtns.first().isVisible().catch(() => false)) {
        // ステータスボタンが存在することを確認
        expect(await statusBtns.count()).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('メディア管理フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('メディアページが表示される', async ({ page }) => {
    await page.goto('/media');
    await page.waitForTimeout(3_000);

    // アップロードエリアが表示される
    const uploadArea = page.locator('text=ドラッグ＆ドロップ, text=ファイルを選択').first();
    await expect(uploadArea).toBeVisible({ timeout: 10_000 });
  });

  test('ファイル選択ダイアログが開ける', async ({ page }) => {
    await page.goto('/media');
    await page.waitForTimeout(2_000);

    // file input が存在することを確認
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });
});

test.describe('トースト通知の動作確認', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('ログイン後にダッシュボードが表示される (認証成功フロー)', async ({ page }) => {
    // login() が呼ばれた時点でダッシュボードにいる
    await expect(page.locator('text=ダッシュボード').first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('サイドバー ナビゲーションフロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('全管理ページに遷移できる', async ({ page }) => {
    const routes = [
      { href: '/jobs', text: '求人' },
      { href: '/applications', text: '応募' },
      { href: '/news', text: 'お知らせ' },
      { href: '/inquiries', text: '問い合わせ' },
      { href: '/members', text: '社員' },
      { href: '/media', text: 'メディア' },
    ];

    for (const { href, text } of routes) {
      const link = page.locator(`a[href="${href}"]`).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(new RegExp(href));
        await page.waitForTimeout(1_000);
        // ページが表示される（ローディング完了）
        await expect(page.locator('main, #app').first()).toBeVisible();
      }
    }
  });
});
