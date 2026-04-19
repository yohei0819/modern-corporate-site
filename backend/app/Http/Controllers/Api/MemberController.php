<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Http\Traits\FormatsApiResponse;
use App\Http\Traits\HandlesFileUpload;
use App\Models\ActivityLog;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Members', description: '社員')]
#[OA\Tag(name: 'Admin/Members', description: '社員管理')]
class MemberController extends Controller
{
    use FormatsApiResponse, HandlesFileUpload;
    #[OA\Get(
        path: '/members',
        summary: '社員一覧（公開）',
        tags: ['Members'],
        responses: [new OA\Response(response: 200, description: '社員一覧')],
    )]
    public function index(Request $request): JsonResponse
    {
        $members = Member::published()
            ->orderBy('sort_order')
            ->paginate(12);

        return $this->paginatedResponse($members);
    }

    #[OA\Get(
        path: '/members/{slug}',
        summary: '社員詳細（公開）',
        tags: ['Members'],
        parameters: [new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: '社員詳細'),
            new OA\Response(response: 404, description: '見つからない'),
        ],
    )]
    public function show(string $slug): JsonResponse
    {
        $member = Member::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $member]);
    }

    #[OA\Get(
        path: '/admin/members',
        summary: '社員一覧（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Members'],
        parameters: [
            new OA\Parameter(name: 'department', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: '社員一覧')],
    )]
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Member::orderBy('sort_order');

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        $members = $query->paginate(20);

        return response()->json($members);
    }

    /**
     * 管理側: 社員詳細
     */
    #[OA\Get(
        path: '/admin/members/{member}',
        summary: '社員詳細（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Members'],
        parameters: [new OA\Parameter(name: 'member', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: '社員詳細')],
    )]
    public function adminShow(Member $member): JsonResponse
    {
        return response()->json(['data' => $member]);
    }

    #[OA\Post(
        path: '/admin/members',
        summary: '社員作成',
        security: [['sanctum' => []]],
        tags: ['Admin/Members'],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(type: 'object'))),
        responses: [new OA\Response(response: 201, description: '作成成功')],
    )]
    public function store(MemberRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->storeUploadedFile($request, $data, 'profile_image', 'members');

        $member = Member::create($data);

        ActivityLog::log('create', 'Member', $member->id, "社員「{$member->name}」を作成しました");

        return response()->json(['data' => $member], 201);
    }

    #[OA\Put(
        path: '/admin/members/{member}',
        summary: '社員更新',
        security: [['sanctum' => []]],
        tags: ['Admin/Members'],
        parameters: [new OA\Parameter(name: 'member', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(type: 'object'))),
        responses: [new OA\Response(response: 200, description: '更新成功')],
    )]
    public function update(MemberRequest $request, Member $member): JsonResponse
    {
        $data = $request->validated();
        $this->updateUploadedFile($request, $member, $data, 'profile_image', 'members');

        $member->update($data);

        ActivityLog::log('update', 'Member', $member->id, "社員「{$member->name}」を更新しました");

        return response()->json(['data' => $member]);
    }

    #[OA\Delete(
        path: '/admin/members/{member}',
        summary: '社員削除',
        security: [['sanctum' => []]],
        tags: ['Admin/Members'],
        parameters: [new OA\Parameter(name: 'member', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: '削除成功')],
    )]
    public function destroy(Member $member): JsonResponse
    {
        ActivityLog::log('delete', 'Member', $member->id, "社員「{$member->name}」を削除しました");

        $this->deleteModelFile($member, 'profile_image');
        $member->delete();

        return response()->json(null, 204);
    }
}
