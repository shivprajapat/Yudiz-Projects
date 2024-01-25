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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnNull()->cascadeOnNull();
            $table->foreignUuid("batch_id")->nullable()->constrained("batches")->cascadeOnNull()->cascadeOnNull();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained("coaching_centres")->cascadeOnNull()->cascadeOnNull();
            $table->string("transaction_id")->nullable();
            $table->date("transaction_date")->nullable();
            $table->time('transaction_time')->nullable();
            // $table->string("coaching_center_name")->nullable();
            // $table->string("coaching_center_logo")->nullable();
            // $table->string("batch_name")->nullable();
            $table->decimal('total_amount', 8, 2)->nullable();
            $table->decimal('commission', 5, 2)->nullable();
            $table->decimal('amount_paid_to_owner', 8, 2)->nullable();
            $table->string("payment_status_end_user")->default((PaymentStatusEnums::FAILED)->value);   //from user
            $table->string("payment_transfer_status")->default((PaymentStatusEnums::PENDING)->value);   // to coaching centre
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
