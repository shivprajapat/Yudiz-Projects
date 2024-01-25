<?php

use App\Enums\PaymentStatusEnums;
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
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid("batch_id")->nullable()->constrained("batches")->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained("coaching_centres")->cascadeOnUpdate()->nullOnDelete();
            $table->string("booking_id")->nullable();
            $table->date('booking_date')->nullable();
            $table->string('booking_time')->nullable();
            $table->float("total_price")->nullable();
            $table->float("convenience_fees")->nullable();
            $table->string("payment_id")->nullable();
            $table->string("no_of_participants")->nullable();
            $table->string("payment_status")->default((PaymentStatusEnums::FAILED)->value);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
