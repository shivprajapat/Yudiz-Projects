<?php

use App\Enums\BannerTypeEnums;
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
        Schema::create('banner_images', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid('coaching_centre_id')->nullable();
            $table->foreign("coaching_centre_id")->references('id')->on("coaching_centres")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('banner_image')->nullable();
            $table->string("banner_type")->default((BannerTypeEnums::URL)->value);
            $table->longText('redirect_url')->nullable();
            $table->longText('banner_note')->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_images');
    }
};
