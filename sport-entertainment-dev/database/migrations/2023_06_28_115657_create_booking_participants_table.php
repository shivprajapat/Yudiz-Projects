<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_participants', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('booking_id')->nullable()->constrained("bookings")->nullOnDelete();
            $table->foreignUuid('participant_id')->nullable()->constrained("participants")->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained("users")->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_participants');
    }
};
