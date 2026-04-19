<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use App\Enums\NewsCategory;
use Illuminate\Foundation\Http\FormRequest;

class NewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $slugUnique = 'unique:news,slug';
        if ($this->route('news')) {
            $slugUnique .= ',' . $this->route('news')->id;
        }

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:200', $slugUnique],
            'category' => ['required', 'string', NewsCategory::rule()],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['required', ContentStatus::rule()],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
