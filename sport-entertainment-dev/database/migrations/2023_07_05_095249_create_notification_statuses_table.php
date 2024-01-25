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
        Schema::create('notification_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid("notification_id")->nullable()->constrained("notifications")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained("coaching_centres")->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum('is_read', ['y', 'n'])->default('n')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_statuses');
    }
};
