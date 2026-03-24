<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPostingRequest;
use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    /**
     * 公開側: 求人一覧（published のみ）
     */
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

        return response()->json($jobs);
    }

    /**
     * 公開側: 求人詳細（slug）
     */
    public function show(string $slug): JsonResponse
    {
        $job = JobPosting::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $job]);
    }

    /**
     * 管理側: 求人一覧（全件）
     */
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
    public function adminShow(JobPosting $jobPosting): JsonResponse
    {
        return response()->json(['data' => $jobPosting]);
    }

    /**
     * 管理側: 求人作成
     */
    public function store(JobPostingRequest $request): JsonResponse
    {
        $job = JobPosting::create($request->validated());

        return response()->json(['data' => $job], 201);
    }

    /**
     * 管理側: 求人更新
     */
    public function update(JobPostingRequest $request, JobPosting $jobPosting): JsonResponse
    {
        $jobPosting->update($request->validated());

        return response()->json(['data' => $jobPosting]);
    }

    /**
     * 管理側: 求人削除
     */
    public function destroy(JobPosting $jobPosting): JsonResponse
    {
        $jobPosting->delete();

        return response()->json(null, 204);
    }
}
