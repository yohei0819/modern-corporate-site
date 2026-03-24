<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationRequest;
use App\Mail\AdminNotification;
use App\Mail\ApplicationReceived;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ApplicationController extends Controller
{
    /**
     * 公開側: 応募送信
     */
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
    public function adminShow(Application $application): JsonResponse
    {
        $application->load('jobPosting');

        return response()->json(['data' => $application]);
    }

    /**
     * 管理側: ステータス更新
     */
    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:unread,reviewing,interviewing,rejected,accepted'],
            'admin_note' => ['nullable', 'string'],
        ]);

        $application->update($validated);

        return response()->json(['data' => $application]);
    }

    /**
     * 管理側: CSV エクスポート
     */
    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $applications = Application::with('jobPosting')->orderByDesc('created_at')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="applications_' . date('Ymd') . '.csv"',
        ];

        return response()->stream(function () use ($applications) {
            $handle = fopen('php://output', 'w');
            // BOM for Excel
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, ['ID', '求人名', '氏名', 'メール', '電話', '年齢', 'ステータス', '応募日']);

            foreach ($applications as $app) {
                fputcsv($handle, [
                    $app->id,
                    $app->jobPosting?->title,
                    $app->name,
                    $app->email,
                    $app->phone,
                    $app->age,
                    $app->status,
                    $app->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}
