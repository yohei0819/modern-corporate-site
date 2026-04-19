<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'department',
        'position',
        'catch_copy',
        'message',
        'profile_image',
        'status',
        'sort_order',
    ];

    protected $appends = ['profile_image_url'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function getProfileImageUrlAttribute(): ?string
    {
        return $this->profile_image ? Storage::disk('public')->url($this->profile_image) : null;
    }

    public function scopePublished($query)
    {
        return $query->where('status', ContentStatus::Published);
    }
}
