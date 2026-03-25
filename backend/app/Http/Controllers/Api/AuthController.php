<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Auth', description: '認証')]
class AuthController extends Controller
{
    #[OA\Post(
        path: '/login',
        summary: 'ログイン',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                    new OA\Property(property: 'password', type: 'string'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'ログイン成功'),
            new OA\Response(response: 401, description: '認証失敗'),
        ],
    )]
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが正しくありません。',
            ], 401);
        }

        // 既存トークンを削除して新しいトークンを発行
        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    #[OA\Post(
        path: '/logout',
        summary: 'ログアウト',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'ログアウト成功'),
        ],
    )]
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'ログアウトしました。']);
    }

    #[OA\Get(
        path: '/me',
        summary: 'ログインユーザー情報',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'ユーザー情報'),
        ],
    )]
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    #[OA\Put(
        path: '/me/profile',
        summary: 'プロフィール更新',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'プロフィール更新成功'),
            new OA\Response(response: 422, description: 'バリデーションエラー'),
        ],
    )]
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'プロフィールを更新しました。',
            'user' => $user->fresh(),
        ]);
    }

    #[OA\Put(
        path: '/me/password',
        summary: 'パスワード変更',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['current_password', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'current_password', type: 'string'),
                    new OA\Property(property: 'password', type: 'string'),
                    new OA\Property(property: 'password_confirmation', type: 'string'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'パスワード変更成功'),
            new OA\Response(response: 422, description: 'バリデーションエラー'),
        ],
    )]
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => '現在のパスワードが正しくありません。',
                'errors' => ['current_password' => ['現在のパスワードが正しくありません。']],
            ], 422);
        }

        $user->update(['password' => $validated['password']]);

        return response()->json([
            'message' => 'パスワードを変更しました。',
        ]);
    }
}
