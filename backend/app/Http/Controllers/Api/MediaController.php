<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Admin/Media', description: 'メディア管理')]
class MediaController extends Controller
{
    #[OA\Get(
        path: '/admin/media',
        summary: 'メディア一覧',
        security: [['sanctum' => []]],
        tags: ['Admin/Media'],
        parameters: [new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'メディア一覧')],
    )]
    public function index(): JsonResponse
    {
        $media = Media::orderByDesc('created_at')->paginate(30);

        return response()->json($media);
    }

    #[OA\Post(
        path: '/admin/media',
        summary: 'メディアアップロード',
        security: [['sanctum' => []]],
        tags: ['Admin/Media'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['file'],
                    properties: [new OA\Property(property: 'file', type: 'string', format: 'binary')],
                ),
            ),
        ),
        responses: [new OA\Response(response: 201, description: 'アップロード成功')],
    )]
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,svg', 'max:5120'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');

        $media = Media::create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json(['data' => $media], 201);
    }

    #[OA\Delete(
        path: '/admin/media/{media}',
        summary: 'メディア削除',
        security: [['sanctum' => []]],
        tags: ['Admin/Media'],
        parameters: [new OA\Parameter(name: 'media', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: '削除成功')],
    )]
    public function destroy(Media $media): JsonResponse
    {
        Storage::disk('public')->delete($media->file_path);

        $media->delete();

        return response()->json(null, 204);
    }
}
