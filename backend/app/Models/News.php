<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'excerpt',
        'body',
        'thumbnail',
        'status',
        'published_at',
    ];

    protected $appends = ['thumbnail_url'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }
        return Storage::disk('public')->url($this->thumbnail);
    }

    public function scopePublished($query)
    {
        return $query->where('status', ContentStatus::Published)
                     ->where('published_at', '<=', now());
    }
}
