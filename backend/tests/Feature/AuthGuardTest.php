<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Inquiry;
use App\Models\JobPosting;
use App\Models\Member;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthGuardTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    #[DataProvider('protectedEndpointsProvider')]
    public function 未認証で管理APIにアクセスすると401(string $method, string $uri): void
    {
        $response = $this->json($method, $uri);

        $response->assertUnauthorized();
    }

    public static function protectedEndpointsProvider(): array
    {
        return [
            '認証ユーザー取得' => ['GET', '/api/me'],
            'ログアウト' => ['POST', '/api/logout'],
            '求人一覧(管理)' => ['GET', '/api/admin/jobs'],
            '求人作成' => ['POST', '/api/admin/jobs'],
            '求人更新' => ['PUT', '/api/admin/jobs/1'],
            '求人削除' => ['DELETE', '/api/admin/jobs/1'],
            '応募一覧' => ['GET', '/api/admin/applications'],
            '応募エクスポート' => ['GET', '/api/admin/applications/export'],
            '応募詳細' => ['GET', '/api/admin/applications/1'],
            '応募ステータス更新' => ['PUT', '/api/admin/applications/1/status'],
            '社員一覧(管理)' => ['GET', '/api/admin/members'],
            '社員作成' => ['POST', '/api/admin/members'],
            '社員更新' => ['PUT', '/api/admin/members/1'],
            '社員削除' => ['DELETE', '/api/admin/members/1'],
            'お知らせ一覧(管理)' => ['GET', '/api/admin/news'],
            'お知らせ作成' => ['POST', '/api/admin/news'],
            'お知らせ更新' => ['PUT', '/api/admin/news/1'],
            'お知らせ削除' => ['DELETE', '/api/admin/news/1'],
            '問い合わせ一覧' => ['GET', '/api/admin/inquiries'],
            '問い合わせ詳細' => ['GET', '/api/admin/inquiries/1'],
            '問い合わせ更新' => ['PUT', '/api/admin/inquiries/1'],
            'メディア一覧' => ['GET', '/api/admin/media'],
            'メディアアップロード' => ['POST', '/api/admin/media'],
            'メディア削除' => ['DELETE', '/api/admin/media/1'],
        ];
    }

    #[Test]
    #[DataProvider('publicEndpointsProvider')]
    public function 公開APIは認証不要でアクセスできる(string $method, string $uri): void
    {
        $response = $this->json($method, $uri);

        // 401 でないことを確認（404 や 200 は許容）
        $this->assertNotEquals(401, $response->getStatusCode());
    }

    public static function publicEndpointsProvider(): array
    {
        return [
            '求人一覧(公開)' => ['GET', '/api/jobs'],
            '社員一覧(公開)' => ['GET', '/api/members'],
            'お知らせ一覧(公開)' => ['GET', '/api/news'],
            'ログイン' => ['POST', '/api/login'],
        ];
    }
}
