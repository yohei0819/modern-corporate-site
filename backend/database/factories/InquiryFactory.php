<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'company' => fake()->optional(0.7)->company(),
            'message' => fake()->realText(200),
            'status' => fake()->randomElement(['unread', 'replied']),
            'admin_note' => fake()->optional(0.3)->realText(100),
        ];
    }
}
