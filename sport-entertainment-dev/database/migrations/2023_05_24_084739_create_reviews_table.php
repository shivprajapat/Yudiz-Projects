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
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId("user_id")->nullable()->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained('coaching_centres')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid("batch_id")->nullable()->constrained('batches')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid("booking_id")->nullable()->constrained('bookings')->nullOnDelete()->cascadeOnUpdate();

            $table->date("review_post_date")->nullable();
            $table->string("review_post_time")->nullable();

            $table->unsignedFloat('rating', 4, 2)->nullable();
            $table->text('review')->nullable();
            $table->tinyInteger('is_approved')->default(StatusEnums::INACTIVE->value); //0->not 1->approve if admin is approve this review and coment then only show

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
