<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained('job_postings')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('email', 255);
            $table->string('phone', 20);
            $table->unsignedTinyInteger('age')->nullable();
            $table->text('message')->nullable();
            $table->string('resume_path', 500)->nullable();
            $table->string('portfolio_url', 500)->nullable();
            $table->enum('status', ['unread', 'reviewing', 'interviewing', 'rejected', 'accepted'])->default('unread');
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index('status', 'idx_applications_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
