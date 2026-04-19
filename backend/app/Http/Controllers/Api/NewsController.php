<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Http\Traits\FormatsApiResponse;
use App\Http\Traits\HandlesFileUpload;
use App\Models\ActivityLog;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'News', description: 'お知らせ')]
#[OA\Tag(name: 'Admin/News', description: 'お知らせ管理')]
class NewsController extends Controller
{
    use FormatsApiResponse, HandlesFileUpload;
    #[OA\Get(
        path: '/news',
        summary: 'お知らせ一覧（公開）',
        tags: ['News'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: 'お知らせ一覧')],
    )]
    public function index(Request $request): JsonResponse
    {
        $query = News::published()->orderByDesc('published_at');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $news = $query->paginate(12);

        return $this->paginatedResponse($news);
    }

    #[OA\Get(
        path: '/news/{slug}',
        summary: 'お知らせ詳細（公開）',
        tags: ['News'],
        parameters: [new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'お知らせ詳細'),
            new OA\Response(response: 404, description: '見つからない'),
        ],
    )]
    public function show(string $slug): JsonResponse
    {
        $news = News::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $news]);
    }

    #[OA\Get(
        path: '/admin/news',
        summary: 'お知らせ一覧（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/News'],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'category', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: 'お知らせ一覧')],
    )]
    public function adminIndex(Request $request): JsonResponse
    {
        $query = News::orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $news = $query->paginate(20);

        return response()->json($news);
    }

    /**
     * 管理側: お知らせ詳細
     */
    #[OA\Get(
        path: '/admin/news/{news}',
        summary: 'お知らせ詳細（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/News'],
        parameters: [new OA\Parameter(name: 'news', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'お知らせ詳細')],
    )]
    public function adminShow(News $news): JsonResponse
    {
        return response()->json(['data' => $news]);
    }

    #[OA\Post(
        path: '/admin/news',
        summary: 'お知らせ作成',
        security: [['sanctum' => []]],
        tags: ['Admin/News'],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(type: 'object'))),
        responses: [new OA\Response(response: 201, description: '作成成功')],
    )]
    public function store(NewsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->storeUploadedFile($request, $data, 'thumbnail', 'news');

        $news = News::create($data);

        ActivityLog::log('create', 'News', $news->id, "お知らせ「{$news->title}」を作成しました");

        return response()->json(['data' => $news], 201);
    }

    #[OA\Put(
        path: '/admin/news/{news}',
        summary: 'お知らせ更新',
        security: [['sanctum' => []]],
        tags: ['Admin/News'],
        parameters: [new OA\Parameter(name: 'news', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(type: 'object'))),
        responses: [new OA\Response(response: 200, description: '更新成功')],
    )]
    public function update(NewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();
        $this->updateUploadedFile($request, $news, $data, 'thumbnail', 'news');

        $news->update($data);

        ActivityLog::log('update', 'News', $news->id, "お知らせ「{$news->title}」を更新しました");

        return response()->json(['data' => $news]);
    }

    #[OA\Delete(
        path: '/admin/news/{news}',
        summary: 'お知らせ削除',
        security: [['sanctum' => []]],
        tags: ['Admin/News'],
        parameters: [new OA\Parameter(name: 'news', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: '削除成功')],
    )]
    public function destroy(News $news): JsonResponse
    {
        ActivityLog::log('delete', 'News', $news->id, "お知らせ「{$news->title}」を削除しました");

        $this->deleteModelFile($news, 'thumbnail');
        $news->delete();

        return response()->json(null, 204);
    }
}
