<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarot_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('guest_ip')->nullable();
            $table->text('input_text')->nullable();
            $table->string('source')->default('text'); // text, spotify, steam, github, strava, youtube, discord
            $table->json('source_data')->nullable(); // social media data that was used
            $table->foreignId('main_tarot_id')->constrained('tarots')->onDelete('cascade');
            $table->string('main_tarot_name');
            $table->text('short_explanation');
            $table->text('long_explanation');
            $table->json('support_tarots'); // [{id, name, image, reason}]
            $table->json('challenge_tarots'); // [{id, name, image, reason}]
            $table->string('share_slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarot_readings');
    }
};
