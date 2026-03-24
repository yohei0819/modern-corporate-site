<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = fake()->realText(40);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(1, 999),
            'category' => fake()->randomElement(['info', 'press', 'event']),
            'excerpt' => fake()->realText(100),
            'body' => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'thumbnail' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }
}
