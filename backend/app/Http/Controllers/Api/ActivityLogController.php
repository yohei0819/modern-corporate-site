<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Admin/ActivityLogs', description: 'アクティビティログ')]
class ActivityLogController extends Controller
{
    #[OA\Get(
        path: '/admin/activity-logs',
        summary: 'アクティビティログ一覧',
        security: [['sanctum' => []]],
        tags: ['Admin/ActivityLogs'],
        parameters: [
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: 'アクティビティログ一覧')],
    )]
    public function index(Request $request): JsonResponse
    {
        $logs = ActivityLog::with('user:id,name')
            ->orderByDesc('created_at')
            ->paginate(30);

        return response()->json($logs);
    }
}
