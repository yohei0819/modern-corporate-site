<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $slugUnique = 'unique:job_postings,slug';
        if ($this->route('job_posting')) {
            $slugUnique .= ',' . $this->route('job_posting')->id;
        }

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:200', $slugUnique],
            'employment_type' => ['required', 'string', 'max:50'],
            'location' => ['required', 'string', 'max:100'],
            'salary_text' => ['nullable', 'string', 'max:200'],
            'summary' => ['required', 'string'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
            'sort_order' => ['integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
