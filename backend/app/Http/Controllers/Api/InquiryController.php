<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InquiryRequest;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * 公開側: 問い合わせ送信
     */
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
    public function adminShow(Inquiry $inquiry): JsonResponse
    {
        return response()->json(['data' => $inquiry]);
    }

    /**
     * 管理側: 対応済み / メモ更新
     */
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
