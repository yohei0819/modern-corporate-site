<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ApplicationTest extends TestCase
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

    // ─── 公開API（応募フォーム送信）───

#[Test]
    public function 公開_応募を送信できる(): void
    {
        Mail::fake();
        $job = JobPosting::factory()->published()->create();

        $response = $this->postJson('/api/applications', [
            'job_posting_id' => $job->id,
            'name' => '山田太郎',
            'email' => 'yamada@example.com',
            'phone' => '090-1234-5678',
            'age' => 28,
            'message' => 'よろしくお願いいたします。',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', '山田太郎');

        $this->assertDatabaseHas('applications', [
            'email' => 'yamada@example.com',
            'job_posting_id' => $job->id,
        ]);

        Mail::assertSent(\App\Mail\ApplicationReceived::class);
        Mail::assertSent(\App\Mail\AdminNotification::class);
    }

#[Test]
    public function 公開_応募バリデーションエラー(): void
    {
        $response = $this->postJson('/api/applications', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['job_posting_id', 'name', 'email', 'phone']);
    }

#[Test]
    public function 公開_存在しない求人IDへの応募は失敗(): void
    {
        $response = $this->postJson('/api/applications', [
            'job_posting_id' => 99999,
            'name' => '山田太郎',
            'email' => 'yamada@example.com',
            'phone' => '090-1234-5678',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['job_posting_id']);
    }

    // ─── 管理API ───

#[Test]
    public function 管理_応募一覧を取得(): void
    {
        $job = JobPosting::factory()->published()->create();
        Application::factory(5)->create(['job_posting_id' => $job->id]);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/applications');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

#[Test]
    public function 管理_応募一覧をstatusでフィルタ(): void
    {
        $job = JobPosting::factory()->published()->create();
        Application::factory(3)->create(['job_posting_id' => $job->id, 'status' => 'unread']);
        Application::factory(2)->create(['job_posting_id' => $job->id, 'status' => 'accepted']);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/applications?status=unread');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

#[Test]
    public function 管理_応募詳細を取得(): void
    {
        $job = JobPosting::factory()->published()->create();
        $app = Application::factory()->create(['job_posting_id' => $job->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/admin/applications/{$app->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $app->id);
    }

#[Test]
    public function 管理_応募ステータスを更新(): void
    {
        $job = JobPosting::factory()->published()->create();
        $app = Application::factory()->create([
            'job_posting_id' => $job->id,
            'status' => 'unread',
        ]);

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/applications/{$app->id}/status", [
                'status' => 'interviewing',
                'admin_note' => '面接調整中',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'interviewing')
            ->assertJsonPath('data.admin_note', '面接調整中');

        $this->assertDatabaseHas('applications', [
            'id' => $app->id,
            'status' => 'interviewing',
        ]);
    }

#[Test]
    public function 管理_応募ステータス更新_無効な値(): void
    {
        $job = JobPosting::factory()->published()->create();
        $app = Application::factory()->create(['job_posting_id' => $job->id]);

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/applications/{$app->id}/status", [
                'status' => 'invalid-status',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

#[Test]
    public function 管理_CSVエクスポート(): void
    {
        $job = JobPosting::factory()->published()->create();
        Application::factory(3)->create(['job_posting_id' => $job->id]);

        $response = $this->withToken($this->token)
            ->get('/api/admin/applications/export');

        $response->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    }
}
