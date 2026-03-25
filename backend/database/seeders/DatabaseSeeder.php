<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            JobPostingSeeder::class,
            MemberSeeder::class,
            NewsSeeder::class,
            ApplicationSeeder::class,
            InquirySeeder::class,
        ]);
    }
}
