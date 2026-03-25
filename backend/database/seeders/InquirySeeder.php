<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        // 未読 7 件 + 対応済み 5 件
        Inquiry::factory(7)->create(['status' => 'unread']);
        Inquiry::factory(5)->create(['status' => 'replied']);
    }
}
