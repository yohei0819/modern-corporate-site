<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class InquiryTest extends TestCase
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
    public function 公開_問い合わせを送信できる(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/inquiries', [
            'name' => '田中花子',
            'email' => 'tanaka@example.com',
            'company' => '株式会社テスト',
            'message' => 'テストの問い合わせです。',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', '田中花子');

        $this->assertDatabaseHas('inquiries', [
            'email' => 'tanaka@example.com',
        ]);

        Mail::assertSent(\App\Mail\InquiryReceived::class);
    }

#[Test]
    public function 公開_問い合わせバリデーションエラー(): void
    {
        $response = $this->postJson('/api/inquiries', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'message']);
    }

#[Test]
    public function 公開_companyは任意(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/inquiries', [
            'name' => '田中花子',
            'email' => 'tanaka@example.com',
            'message' => 'テスト',
        ]);

        $response->assertCreated();
    }

    // ─── 管理API ───

#[Test]
    public function 管理_問い合わせ一覧を取得(): void
    {
        Inquiry::factory(5)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/inquiries');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

#[Test]
    public function 管理_問い合わせ一覧をstatusでフィルタ(): void
    {
        Inquiry::factory(3)->create(['status' => 'unread']);
        Inquiry::factory(2)->create(['status' => 'replied']);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/inquiries?status=unread');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

#[Test]
    public function 管理_問い合わせ詳細を取得(): void
    {
        $inquiry = Inquiry::factory()->create();

        $response = $this->withToken($this->token)
            ->getJson("/api/admin/inquiries/{$inquiry->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $inquiry->id);
    }

#[Test]
    public function 管理_問い合わせを対応済みに更新(): void
    {
        $inquiry = Inquiry::factory()->create(['status' => 'unread']);

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/inquiries/{$inquiry->id}", [
                'status' => 'replied',
                'admin_note' => 'メールで返信済み',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'replied')
            ->assertJsonPath('data.admin_note', 'メールで返信済み');
    }
}
