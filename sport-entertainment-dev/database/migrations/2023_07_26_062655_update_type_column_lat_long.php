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
        if (Schema::hasColumns('coaching_centres', ['lat', 'long'])) {
            Schema::table('coaching_centres', function (Blueprint $table) {
                $table->dropColumn('lat');
                $table->dropColumn('long');
            });
        }

        // Add the 'lat' and 'long' columns with the correct data type
        Schema::table('coaching_centres', function (Blueprint $table) {
            $table->decimal('lat', 9, 6);
            $table->decimal('long', 9, 6);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumns('coaching_centres', ['lat', 'long'])) {
            Schema::table('coaching_centres', function (Blueprint $table) {
                $table->dropColumn('lat');
                $table->dropColumn('long');
            });
        }
    }
};
