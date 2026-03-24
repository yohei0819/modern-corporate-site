<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MemberFactory extends Factory
{
    protected $model = Member::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 999),
            'department' => fake()->randomElement(['エンジニアリング', 'デザイン', 'マーケティング', '人事', '営業', '経営企画']),
            'position' => fake()->randomElement(['マネージャー', 'リーダー', 'シニア', 'ジュニア', 'インターン']),
            'catch_copy' => fake()->realText(50),
            'message' => fake()->realText(400),
            'profile_image' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
        ]);
    }
}
