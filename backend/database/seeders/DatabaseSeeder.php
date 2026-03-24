<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Inquiry;
use App\Models\JobPosting;
use App\Models\Member;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 管理者ユーザー
        User::factory()->create([
            'name' => '管理者',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 求人 15 件（10 件公開 / 5 件下書き）
        $publishedJobs = JobPosting::factory(10)->published()->create();
        JobPosting::factory(5)->create(['status' => 'draft']);

        // 社員 10 件（8 件公開）
        Member::factory(8)->published()->create();
        Member::factory(2)->create(['status' => 'draft']);

        // お知らせ 15 件（12 件公開）
        News::factory(12)->published()->create();
        News::factory(3)->create(['status' => 'draft']);

        // 応募 20 件（公開中の求人に紐づけ）
        foreach ($publishedJobs as $job) {
            Application::factory(rand(1, 4))->create([
                'job_posting_id' => $job->id,
            ]);
        }

        // 問い合わせ 10 件
        Inquiry::factory(10)->create();
    }
}
