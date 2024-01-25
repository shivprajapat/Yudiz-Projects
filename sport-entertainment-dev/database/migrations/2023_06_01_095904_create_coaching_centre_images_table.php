<?php

use App\Enums\ImageAsBannerEnums;
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
        Schema::create('coaching_centre_images', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid('coaching_centre_id')->nullable();
            $table->foreign("coaching_centre_id")->references('id')->on("coaching_centres")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('image_path')->nullable();
            $table->tinyInteger("is_banner")->default((ImageAsBannerEnums::IS_NOT_BANNER)->value); //1=>banner 0=>not banner
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coaching_centre_images');
    }
};
