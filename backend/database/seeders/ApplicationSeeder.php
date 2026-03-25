<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $publishedJobs = JobPosting::where('status', 'published')->get();

        foreach ($publishedJobs as $job) {
            // 人気求人は応募多め
            $count = str_contains($job->title, 'エンジニア') ? rand(3, 6) : rand(1, 3);

            Application::factory($count)->create([
                'job_posting_id' => $job->id,
            ]);
        }
    }
}
