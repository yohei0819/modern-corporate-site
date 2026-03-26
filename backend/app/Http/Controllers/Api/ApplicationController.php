<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationRequest;
use App\Mail\AdminNotification;
use App\Mail\ApplicationReceived;
use App\Models\ActivityLog;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Applications', description: '応募')]
#[OA\Tag(name: 'Admin/Applications', description: '応募管理')]
class ApplicationController extends Controller
{
    /**
     * 公開側: 応募送信
     */
    #[OA\Post(
        path: '/applications',
        summary: '応募送信（公開）',
        tags: ['Applications'],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(mediaType: 'multipart/form-data', schema: new OA\Schema(type: 'object'))),
        responses: [
            new OA\Response(response: 201, description: '応募完了'),
            new OA\Response(response: 422, description: 'バリデーションエラー'),
        ],
    )]
    public function store(ApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')
                ->store('resumes', 'public');
        }

        $application = Application::create($data);
        $application->load('jobPosting');

        // 応募者への自動返信
        Mail::to($application->email)->send(new ApplicationReceived($application));

        // 管理者への通知
        Mail::to(config('mail.from.address'))->send(new AdminNotification($application));

        return response()->json(['data' => $application], 201);
    }

    /**
     * 管理側: 応募一覧
     */
    #[OA\Get(
        path: '/admin/applications',
        summary: '応募一覧（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Applications'],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'keyword', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: '応募一覧')],
    )]
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Application::with('jobPosting')->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        $applications = $query->paginate(20);

        return response()->json($applications);
    }

    /**
     * 管理側: 応募詳細
     */
    #[OA\Get(
        path: '/admin/applications/{application}',
        summary: '応募詳細（管理）',
        security: [['sanctum' => []]],
        tags: ['Admin/Applications'],
        parameters: [new OA\Parameter(name: 'application', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: '応募詳細')],
    )]
    public function adminShow(Application $application): JsonResponse
    {
        $application->load('jobPosting');

        return response()->json(['data' => $application]);
    }

    /**
     * 管理側: ステータス更新
     */
    #[OA\Put(
        path: '/admin/applications/{application}/status',
        summary: '応募ステータス更新',
        security: [['sanctum' => []]],
        tags: ['Admin/Applications'],
        parameters: [new OA\Parameter(name: 'application', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['new', 'reviewing', 'interviewed', 'accepted', 'rejected']),
                    new OA\Property(property: 'admin_note', type: 'string', nullable: true),
                ],
            ),
        ),
        responses: [new OA\Response(response: 200, description: '更新成功')],
    )]
    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,reviewing,interviewed,accepted,rejected'],
            'admin_note' => ['nullable', 'string'],
        ]);

        $application->update($validated);

        ActivityLog::log('status_change', 'Application', $application->id, "応募「{$application->name}」のステータスを{$validated['status']}に変更しました");

        return response()->json(['data' => $application]);
    }

    /**
     * 管理側: CSV エクスポート
     */
    #[OA\Get(
        path: '/admin/applications/export',
        summary: '応募 CSV エクスポート',
        security: [['sanctum' => []]],
        tags: ['Admin/Applications'],
        responses: [new OA\Response(response: 200, description: 'CSV ファイル')],
    )]
    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="applications_' . date('Ymd') . '.csv"',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            // BOM for Excel
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, ['ID', '求人名', '氏名', 'メール', '電話', '年齢', 'ステータス', '応募日']);

            Application::with('jobPosting')
                ->orderByDesc('created_at')
                ->chunk(500, function ($applications) use ($handle) {
                    foreach ($applications as $app) {
                        fputcsv($handle, [
                            $app->id,
                            $app->jobPosting?->title ?? '',
                            $app->name,
                            $app->email,
                            $app->phone,
                            $app->age,
                            $app->status,
                            $app->created_at->format('Y-m-d H:i'),
                        ]);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }
}
