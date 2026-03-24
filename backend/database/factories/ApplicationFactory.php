<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'job_posting_id' => JobPosting::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'age' => fake()->numberBetween(22, 45),
            'message' => fake()->optional(0.6)->realText(200),
            'resume_path' => null,
            'portfolio_url' => fake()->optional(0.4)->url(),
            'status' => fake()->randomElement(['unread', 'reviewing', 'interviewing', 'rejected', 'accepted']),
            'admin_note' => fake()->optional(0.3)->realText(100),
        ];
    }
}
