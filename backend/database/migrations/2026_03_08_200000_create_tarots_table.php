<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarots', function (Blueprint $table) {
            $table->id();
            $table->integer('number')->unique();
            $table->string('name');
            $table->string('image');
            $table->text('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->string('keywords')->nullable();
            $table->string('category')->default('major'); // major, wands, swords, pentacles, cups
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarots');
    }
};
