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
        Schema::create('batches', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained("coaching_centres")->cascadeOnUpdate()->cascadeOnDelete();

            $table->string("name")->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->foreignUuid("sport_id")->nullable()->constrained("sports")->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid("age_id")->constrained("age_groups")->nullable()->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer("batch_size")->nullable();
            $table->integer("booked_batch_size")->nullable();

            $table->string("session_days")->nullable();

            $table->string("start_time")->nullable();
            $table->string("end_time")->nullable();
            $table->integer("number_of_session")->nullable();

            $table->float("price")->nullable();
            $table->float("actual_price")->nullable();
            $table->text("brief_details")->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
            $table->integer("live_status")->nullable();  //0=>inactive 1=>start
            $table->tinyInteger("completion_status")->default("0")->nullable();  //1=>completed, 0=>on-going
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
