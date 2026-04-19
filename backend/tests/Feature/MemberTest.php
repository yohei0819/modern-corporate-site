<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MemberTest extends TestCase
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
    public function 公開_社員一覧は公開中のみ返す(): void
    {
        Member::factory(3)->published()->create();
        Member::factory(2)->create(['status' => 'draft']);

        $response = $this->getJson('/api/members');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

#[Test]
    public function 公開_社員詳細をslugで取得(): void
    {
        $member = Member::factory()->published()->create(['slug' => 'yamada-1']);

        $response = $this->getJson('/api/members/yamada-1');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'yamada-1');
    }

#[Test]
    public function 公開_下書き社員は取得できない(): void
    {
        Member::factory()->create(['slug' => 'draft-member', 'status' => 'draft']);

        $response = $this->getJson('/api/members/draft-member');

        $response->assertNotFound();
    }

    // ─── 管理API ───

#[Test]
    public function 管理_社員一覧は全件返す(): void
    {
        Member::factory(3)->published()->create();
        Member::factory(2)->create(['status' => 'draft']);

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/members');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

#[Test]
    public function 管理_社員作成(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/admin/members', [
                'name' => 'テスト社員',
                'slug' => 'test-member',
                'department' => 'エンジニアリング',
                'position' => 'シニア',
                'catch_copy' => 'テスト用のキャッチコピー',
                'message' => 'テスト用のメッセージ',
                'status' => 'published',
                'sort_order' => 0,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'テスト社員');

        $this->assertDatabaseHas('members', ['slug' => 'test-member']);
    }

#[Test]
    public function 管理_社員更新(): void
    {
        $member = Member::factory()->create();

        $response = $this->withToken($this->token)
            ->putJson("/api/admin/members/{$member->id}", [
                'name' => '更新社員',
                'slug' => $member->slug,
                'department' => 'デザイン',
                'position' => 'リーダー',
                'catch_copy' => '更新後のキャッチ',
                'message' => '更新後のメッセージ',
                'status' => 'published',
                'sort_order' => 5,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.name', '更新社員')
            ->assertJsonPath('data.department', 'デザイン');
    }

#[Test]
    public function 管理_社員削除(): void
    {
        $member = Member::factory()->create();

        $response = $this->withToken($this->token)
            ->deleteJson("/api/admin/members/{$member->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('members', ['id' => $member->id]);
    }
}
