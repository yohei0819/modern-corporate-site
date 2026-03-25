<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPostingRequest;
use App\Models\ActivityLog;
use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Jobs', description: '求人')]
#[OA\Tag(name: 'Admin/Jobs', description: '求人管理')]
class JobPostingController extends Controller
{
    /**
     * 公開側: 求人一覧（published のみ）
     */
    #[OA\Get(
        path: '/jobs',
        summary: '求人一覧（公開）',
        tags: ['Jobs'],
        parameters: [
            new OA\Parameter(name: 'employment_type', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'location', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: '求人一覧')],
    )]
    public function index(Request $request): JsonResponse
    {
        $query = JobPosting::published()->orderBy('sort_order');

        if ($request->filled('employment_type')) {
            $query->where('employment_type', $request->employment_type);
        }
        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        $jobs = $query->paginate(12);

        return response()->json([
            'data' => $jobs->items(),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
        ]);
    }

    /**
     * 公開側: 求人詳細（slug）
     */
    #[OA\Get(
        path: '/jobs/{slug}',
        summary: '求人詳細（公開）',
        tags: ['Jobs'],
        parameters: [new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: '求人詳細'),
            new OA\Response(response: 404, description: '見つからない'),
        ],
    )]
    public function show(string $slug): JsonResponse
    {
        $job = JobPosting::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $job]);
    }

    /**
     * 管理側: 求人一覧（全件）
     */
    #[OA\Get(
        path: '/admin/jobs',
        summary: '求人一覧（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Jobs'],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: '求人一覧')],
    )]
    public function adminIndex(Request $request): JsonResponse
    {
        $query = JobPosting::orderBy('sort_order');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $jobs = $query->paginate(20);

        return response()->json($jobs);
    }

    /**
     * 管理側: 求人詳細
     */
    #[OA\Get(
        path: '/admin/jobs/{job_posting}',
        summary: '求人詳細（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Jobs'],
        parameters: [new OA\Parameter(name: 'job_posting', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: '求人詳細')],
    )]
    public function adminShow(JobPosting $jobPosting): JsonResponse
    {
        return response()->json(['data' => $jobPosting]);
    }

    /**
     * 管理側: 求人作成
     */
    #[OA\Post(
        path: '/admin/jobs',
        summary: '求人作成',
        security: [['sanctum' => []]],
        tags: ['Admin/Jobs'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(type: 'object')),
        responses: [new OA\Response(response: 201, description: '作成成功')],
    )]
    public function store(JobPostingRequest $request): JsonResponse
    {
        $job = JobPosting::create($request->validated());

        ActivityLog::log('create', 'JobPosting', $job->id, "求人「{$job->title}」を作成しました");

        return response()->json(['data' => $job], 201);
    }

    /**
     * 管理側: 求人更新
     */
    #[OA\Put(
        path: '/admin/jobs/{job_posting}',
        summary: '求人更新',
        security: [['sanctum' => []]],
        tags: ['Admin/Jobs'],
        parameters: [new OA\Parameter(name: 'job_posting', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(type: 'object')),
        responses: [new OA\Response(response: 200, description: '更新成功')],
    )]
    public function update(JobPostingRequest $request, JobPosting $jobPosting): JsonResponse
    {
        $jobPosting->update($request->validated());

        ActivityLog::log('update', 'JobPosting', $jobPosting->id, "求人「{$jobPosting->title}」を更新しました");

        return response()->json(['data' => $jobPosting]);
    }

    /**
     * 管理側: 求人削除
     */
    #[OA\Delete(
        path: '/admin/jobs/{job_posting}',
        summary: '求人削除',
        security: [['sanctum' => []]],
        tags: ['Admin/Jobs'],
        parameters: [new OA\Parameter(name: 'job_posting', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: '削除成功')],
    )]
    public function destroy(JobPosting $jobPosting): JsonResponse
    {
        ActivityLog::log('delete', 'JobPosting', $jobPosting->id, "求人「{$jobPosting->title}」を削除しました");

        $jobPosting->delete();

        return response()->json(null, 204);
    }
}
