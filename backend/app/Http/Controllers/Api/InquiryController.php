<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InquiryRequest;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Inquiries', description: '問い合わせ')]
#[OA\Tag(name: 'Admin/Inquiries', description: '問い合わせ管理')]
class InquiryController extends Controller
{
    /**
     * 公開側: 問い合わせ送信
     */
    #[OA\Post(
        path: '/inquiries',
        summary: '問い合わせ送信（公開）',
        tags: ['Inquiries'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(type: 'object')),
        responses: [
            new OA\Response(response: 201, description: '送信完了'),
            new OA\Response(response: 422, description: 'バリデーションエラー'),
        ],
    )]
    public function store(InquiryRequest $request): JsonResponse
    {
        $inquiry = Inquiry::create($request->validated());

        // 管理者通知
        Mail::to(config('mail.from.address'))->send(new InquiryReceived($inquiry));

        return response()->json(['data' => $inquiry], 201);
    }

    /**
     * 管理側: 問い合わせ一覧
     */
    #[OA\Get(
        path: '/admin/inquiries',
        summary: '問い合わせ一覧（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Inquiries'],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: '問い合わせ一覧')],
    )]
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Inquiry::orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $inquiries = $query->paginate(20);

        return response()->json($inquiries);
    }

    /**
     * 管理側: 問い合わせ詳細
     */
    #[OA\Get(
        path: '/admin/inquiries/{inquiry}',
        summary: '問い合わせ詳細（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Inquiries'],
        parameters: [new OA\Parameter(name: 'inquiry', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: '問い合わせ詳細')],
    )]
    public function adminShow(Inquiry $inquiry): JsonResponse
    {
        return response()->json(['data' => $inquiry]);
    }

    /**
     * 管理側: 対応済み / メモ更新
     */
    #[OA\Put(
        path: '/admin/inquiries/{inquiry}',
        summary: '問い合わせ更新（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Inquiries'],
        parameters: [new OA\Parameter(name: 'inquiry', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['unread', 'replied'], nullable: true),
                    new OA\Property(property: 'admin_note', type: 'string', nullable: true),
                ],
            ),
        ),
        responses: [new OA\Response(response: 200, description: '更新成功')],
    )]
    public function adminUpdate(Request $request, Inquiry $inquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'in:unread,replied'],
            'admin_note' => ['nullable', 'string'],
        ]);

        $inquiry->update($validated);

        return response()->json(['data' => $inquiry]);
    }
}
