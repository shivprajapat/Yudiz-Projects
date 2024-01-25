<?php

use App\Enums\StatusEnums;
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
        Schema::create('age_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('age_name')->nullable();
            $table->integer('minimum_age')->nullable();
            $table->integer('maximum_age')->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('age_groups');
    }
};
