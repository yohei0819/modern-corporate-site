<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->token = $this->admin->createToken('test')->plainTextToken;
        Storage::fake('public');
    }

#[Test]
    public function メディア一覧を取得(): void
    {
        Media::factory(5)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/admin/media');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

#[Test]
    public function 画像をアップロードできる(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);

        $response = $this->withToken($this->token)
            ->postJson('/api/admin/media', [
                'file' => $file,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.file_name', 'test.jpg')
            ->assertJsonPath('data.mime_type', 'image/jpeg');

        $this->assertDatabaseCount('media', 1);
    }

#[Test]
    public function 許可されていないファイル形式は拒否(): void
    {
        $file = UploadedFile::fake()->create('malware.exe', 100, 'application/octet-stream');

        $response = $this->withToken($this->token)
            ->postJson('/api/admin/media', [
                'file' => $file,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

#[Test]
    public function サイズ上限超過は拒否(): void
    {
        $file = UploadedFile::fake()->image('huge.jpg')->size(6000); // 6MB > 5MB limit

        $response = $this->withToken($this->token)
            ->postJson('/api/admin/media', [
                'file' => $file,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

#[Test]
    public function メディアを削除できる(): void
    {
        $media = Media::factory()->create([
            'file_path' => 'media/test.jpg',
        ]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/admin/media/{$media->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('media', ['id' => $media->id]);
    }
}
