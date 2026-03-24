<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = News::published()->orderByDesc('published_at');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $news = $query->paginate(12);

        return response()->json($news);
    }

    public function show(string $slug): JsonResponse
    {
        $news = News::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $news]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $query = News::orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $news = $query->paginate(20);

        return response()->json($news);
    }

    public function store(NewsRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')
                ->store('news', 'public');
        }

        $news = News::create($data);

        return response()->json(['data' => $news], 201);
    }

    public function update(NewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')
                ->store('news', 'public');
        }

        $news->update($data);

        return response()->json(['data' => $news]);
    }

    public function destroy(News $news): JsonResponse
    {
        if ($news->thumbnail) {
            Storage::disk('public')->delete($news->thumbnail);
        }

        $news->delete();

        return response()->json(null, 204);
    }
}
