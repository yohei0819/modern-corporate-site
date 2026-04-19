<?php

namespace Tests\Feature;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class JobPostingTest extends TestCase
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
    public function 公開_求人一覧は公開中のみ返す(): void
    {
        JobPosting::factory(3)->published()->create();
        JobPosting::factory(2)->create(['status' => 'draft']);

        $response = $this->getJson('/api/jobs');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

#[Test]
    public function 公開_求人一覧をemployment_typeでフィルタ(): void
    {
        JobPosting::factory()->published()->create(['employment_type' => 'full-time']);
        JobPosting::factory()->published()->create(['employment_type' => 'contract']);

        $response = $this->getJson('/api/jobs?employment_type=full-time');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

#[Test]
    public function 公開_求人詳細をslugで取得(): void
    {
        $job = JobPosting::factory()->published()->create(['slug' => 'test-job-1']);

        $response = $this->getJson('/api/jobs/test-job-1');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'test-job-1')
            ->assertJsonPath('data.title', $job->title);
    }

#[Test]
    public function 公開_下書き求人はslugで取得できない(): void
    {
        JobPosting::factory()->create(['slug' => 'draft-job', 'status' => 'draft']);

        $response = $this->getJson('/api/jobs/draft-job');

        $response->assertNotFound();
    }

#[Test]
    public function 公開_存在しないslugは404(): void
    {
        $response = $this->getJson('/api/jobs/nonexistent');

        $response->assertNotFound();
    }

    // ─── 管理API ───

#[Test]
    public function 管理_求人一覧は全件返す(): void
    {
        JobPosting::factory(3)->published()->create();
        JobPosting::factory(2)->create(['status' => 'draft']);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/jobs');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

#[Test]
    public function 管理_求人作成(): void
    {
        $data = [
            'title' => 'テストエンジニア',
            'slug' => 'test-engineer',
            'employment_type' => 'full-time',
            'location' => '東京',
            'salary_text' => '年収 500〜800 万円',
            'summary' => 'テスト用の求人概要',
            'description' => 'テスト用の求人詳細',
            'requirements' => 'テスト用の応募条件',
            'status' => 'draft',
            'sort_order' => 0,
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/admin/jobs', $data);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'テストエンジニア')
            ->assertJsonPath('data.slug', 'test-engineer');

        $this->assertDatabaseHas('job_postings', ['slug' => 'test-engineer']);
    }

#[Test]
    public function 管理_求人作成_バリデーションエラー(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/admin/jobs', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'slug', 'employment_type', 'location', 'summary', 'description', 'status']);
    }

#[Test]
    public function 管理_求人更新(): void
    {
        $job = JobPosting::factory()->create();

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/jobs/{$job->id}", [
                'title' => '更新後のタイトル',
                'slug' => $job->slug,
                'employment_type' => 'contract',
                'location' => '大阪',
                'summary' => '更新後の概要',
                'description' => '更新後の詳細',
                'status' => 'published',
                'sort_order' => 10,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.title', '更新後のタイトル')
            ->assertJsonPath('data.employment_type', 'contract');
    }

#[Test]
    public function 管理_求人削除(): void
    {
        $job = JobPosting::factory()->create();

        $response = $this->withToken($this->token)
            ->deleteJson("/api/admin/jobs/{$job->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('job_postings', ['id' => $job->id]);
    }

#[Test]
    public function 管理_slug重複は許可しない(): void
    {
        JobPosting::factory()->create(['slug' => 'existing-slug']);

        $response = $this->withToken($this->token)
            ->postJson('/api/admin/jobs', [
                'title' => '重複テスト',
                'slug' => 'existing-slug',
                'employment_type' => 'full-time',
                'location' => '東京',
                'summary' => 'テスト',
                'description' => 'テスト',
                'status' => 'draft',
                'sort_order' => 0,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }
}
