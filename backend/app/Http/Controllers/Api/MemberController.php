<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        $members = Member::published()
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $members]);
    }

    public function show(string $slug): JsonResponse
    {
        $member = Member::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $member]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $query = Member::orderBy('sort_order');

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        $members = $query->paginate(20);

        return response()->json($members);
    }

    public function store(MemberRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')
                ->store('members', 'public');
        }

        $member = Member::create($data);

        return response()->json(['data' => $member], 201);
    }

    public function update(MemberRequest $request, Member $member): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('profile_image')) {
            if ($member->profile_image) {
                Storage::disk('public')->delete($member->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')
                ->store('members', 'public');
        }

        $member->update($data);

        return response()->json(['data' => $member]);
    }

    public function destroy(Member $member): JsonResponse
    {
        if ($member->profile_image) {
            Storage::disk('public')->delete($member->profile_image);
        }

        $member->delete();

        return response()->json(null, 204);
    }
}
