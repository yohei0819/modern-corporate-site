<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        $extensions = ['jpg', 'png', 'gif', 'webp'];
        $ext = fake()->randomElement($extensions);
        $fileName = fake()->uuid() . '.' . $ext;

        return [
            'file_name' => $fileName,
            'file_path' => 'media/' . $fileName,
            'mime_type' => 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext),
            'size' => fake()->numberBetween(10000, 5000000),
        ];
    }
}
