<?php

namespace Database\Factories;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobPostingFactory extends Factory
{
    protected $model = JobPosting::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'フロントエンドエンジニア',
            'バックエンドエンジニア',
            'フルスタックエンジニア',
            'UI/UXデザイナー',
            'プロジェクトマネージャー',
            'インフラエンジニア',
            'QAエンジニア',
            'データアナリスト',
            'マーケティング担当',
            'カスタマーサクセス',
            '人事担当',
            '営業マネージャー',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(1, 999),
            'employment_type' => fake()->randomElement(['full-time', 'contract', 'part-time', 'internship']),
            'location' => fake()->randomElement(['東京', '大阪', '名古屋', '福岡', 'リモート']),
            'salary_text' => '年収 ' . fake()->numberBetween(3, 10) . '00〜' . fake()->numberBetween(5, 15) . '00 万円',
            'summary' => fake()->realText(100),
            'description' => fake()->realText(500),
            'requirements' => fake()->realText(300),
            'status' => fake()->randomElement(['draft', 'published']),
            'sort_order' => fake()->numberBetween(0, 100),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ]);
    }
}
