<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\NewsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 公開 API（認証不要）
|--------------------------------------------------------------------------
*/

// 求人
Route::middleware('throttle:public-api')->group(function () {
    Route::get('/jobs', [JobPostingController::class, 'index']);
    Route::get('/jobs/{slug}', [JobPostingController::class, 'show']);

    // 社員
    Route::get('/members', [MemberController::class, 'index']);
    Route::get('/members/{slug}', [MemberController::class, 'show']);

    // お知らせ
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);
});

// 応募（公開側）
Route::middleware('throttle:form-submission')->group(function () {
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::post('/inquiries', [InquiryController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| 認証 API
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware(['auth:sanctum', 'throttle:admin-api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // 設定（プロフィール・パスワード変更）
    Route::put('/me/profile', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);

    /*
    |----------------------------------------------------------------------
    | 管理 API（認証必須）
    |----------------------------------------------------------------------
    */

    // 求人管理
    Route::get('/admin/jobs', [JobPostingController::class, 'adminIndex']);
    Route::get('/admin/jobs/{job_posting}', [JobPostingController::class, 'adminShow']);
    Route::post('/admin/jobs', [JobPostingController::class, 'store']);
    Route::put('/admin/jobs/{job_posting}', [JobPostingController::class, 'update']);
    Route::delete('/admin/jobs/{job_posting}', [JobPostingController::class, 'destroy']);

    // 社員管理
    Route::get('/admin/members', [MemberController::class, 'adminIndex']);
    Route::get('/admin/members/{member}', [MemberController::class, 'adminShow']);
    Route::post('/admin/members', [MemberController::class, 'store']);
    Route::put('/admin/members/{member}', [MemberController::class, 'update']);
    Route::delete('/admin/members/{member}', [MemberController::class, 'destroy']);

    // お知らせ管理
    Route::get('/admin/news', [NewsController::class, 'adminIndex']);
    Route::get('/admin/news/{news}', [NewsController::class, 'adminShow']);
    Route::post('/admin/news', [NewsController::class, 'store']);
    Route::put('/admin/news/{news}', [NewsController::class, 'update']);
    Route::delete('/admin/news/{news}', [NewsController::class, 'destroy']);

    // 応募管理
    Route::get('/admin/applications/export', [ApplicationController::class, 'export']);
    Route::get('/admin/applications', [ApplicationController::class, 'adminIndex']);
    Route::get('/admin/applications/{application}', [ApplicationController::class, 'adminShow']);
    Route::get('/admin/applications/{application}/resume', [ApplicationController::class, 'downloadResume']);
    Route::put('/admin/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // 問い合わせ管理
    Route::get('/admin/inquiries', [InquiryController::class, 'adminIndex']);
    Route::get('/admin/inquiries/{inquiry}', [InquiryController::class, 'adminShow']);
    Route::put('/admin/inquiries/{inquiry}', [InquiryController::class, 'adminUpdate']);

    // メディア管理
    Route::get('/admin/media', [MediaController::class, 'index']);
    Route::post('/admin/media', [MediaController::class, 'store']);
    Route::delete('/admin/media/{media}', [MediaController::class, 'destroy']);

    // アクティビティログ
    Route::get('/admin/activity-logs', [ActivityLogController::class, 'index']);
});
