<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

#[Test]
    public function ログイン成功(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonPath('user.email', 'admin@example.com');
    }

#[Test]
    public function ログイン失敗_パスワード不正(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized()
            ->assertJson(['message' => 'メールアドレスまたはパスワードが正しくありません。']);
    }

#[Test]
    public function ログイン失敗_存在しないメール(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nobody@example.com',
            'password' => 'password',
        ]);

        $response->assertUnauthorized();
    }

#[Test]
    public function ログイン失敗_バリデーションエラー(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

#[Test]
    public function ログアウト成功(): void
    {
        $token = $this->admin->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJson(['message' => 'ログアウトしました。']);

        // トークンが無効化されたことを確認
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

#[Test]
    public function ログアウト失敗_未認証(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    }

#[Test]
    public function 認証ユーザー情報の取得(): void
    {
        $token = $this->admin->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response->assertOk()
            ->assertJsonPath('user.email', 'admin@example.com')
            ->assertJsonPath('user.role', 'admin');
    }

#[Test]
    public function 認証ユーザー情報_未認証だと401(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertUnauthorized();
    }
}
