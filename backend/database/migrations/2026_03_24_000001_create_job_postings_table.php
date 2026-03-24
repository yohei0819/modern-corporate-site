<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->string('employment_type', 50);
            $table->string('location', 100);
            $table->string('salary_text', 200)->nullable();
            $table->text('summary');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'sort_order'], 'idx_job_postings_status_sort');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
