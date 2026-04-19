<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NewsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    // ─── 公開API ───

#[Test]
    public function 公開_お知らせ一覧は公開中のみ返す(): void
    {
        News::factory(4)->published()->create();
        News::factory(2)->create(['status' => 'draft']);

        $response = $this->getJson('/api/news');

        $response->assertOk()
            ->assertJsonCount(4, 'data');
    }

#[Test]
    public function 公開_お知らせ一覧をcategoryでフィルタ(): void
    {
        News::factory(2)->published()->create(['category' => 'press']);
        News::factory(3)->published()->create(['category' => 'event']);

        $response = $this->getJson('/api/news?category=press');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

#[Test]
    public function 公開_お知らせ詳細をslugで取得(): void
    {
        $news = News::factory()->published()->create(['slug' => 'test-news-1']);

        $response = $this->getJson('/api/news/test-news-1');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'test-news-1');
    }

#[Test]
    public function 公開_下書きのお知らせは取得できない(): void
    {
        News::factory()->create(['slug' => 'draft-news', 'status' => 'draft']);

        $response = $this->getJson('/api/news/draft-news');

        $response->assertNotFound();
    }

    // ─── 管理API ───

#[Test]
    public function 管理_お知らせ一覧は全件返す(): void
    {
        News::factory(4)->published()->create();
        News::factory(2)->create(['status' => 'draft']);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/news');

        $response->assertOk()
            ->assertJsonCount(6, 'data');
    }

#[Test]
    public function 管理_お知らせ作成(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/admin/news', [
                'title' => 'テストお知らせ',
                'slug' => 'test-news',
                'category' => 'info',
                'excerpt' => 'テスト用の抜粋',
                'body' => '<p>テスト用の本文</p>',
                'status' => 'published',
                'published_at' => '2025-01-01',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'テストお知らせ');

        $this->assertDatabaseHas('news', ['slug' => 'test-news']);
    }

#[Test]
    public function 管理_お知らせ更新(): void
    {
        $news = News::factory()->create();

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/news/{$news->id}", [
                'title' => '更新後のタイトル',
                'slug' => $news->slug,
                'category' => 'event',
                'excerpt' => '更新後の抜粋',
                'body' => '<p>更新後の本文</p>',
                'status' => 'published',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.title', '更新後のタイトル');
    }

#[Test]
    public function 管理_お知らせ削除(): void
    {
        $news = News::factory()->create();

        $response = $this->withToken($this->token)
            ->deleteJson("/api/admin/news/{$news->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }
}
