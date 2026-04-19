<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $slugUnique = 'unique:members,slug';
        if ($this->route('member')) {
            $slugUnique .= ',' . $this->route('member')->id;
        }

        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', $slugUnique],
            'department' => ['required', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:100'],
            'catch_copy' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string'],
            'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['required', ContentStatus::rule()],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
