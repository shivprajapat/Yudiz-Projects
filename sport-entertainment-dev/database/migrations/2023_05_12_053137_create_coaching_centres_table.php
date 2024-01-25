<?php

use App\Enums\AdminApproveEnums;
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
        Schema::create('coaching_centres', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->string("email")->nullable();
            $table->string("mobile_number")->nullable();
            $table->string("password")->nullable();
            $table->string("coaching_name")->nullable(); //coaching centre name
            $table->string("logo")->nullable();
            $table->string("location_name")->nullable();
            $table->float("experience")->nullable();
            $table->text("bio")->nullable();
            $table->text("facility")->nullable();

            //coaching centre deails
            $table->string("contact_number")->nullable();
            $table->string("contact_email")->nullable();
            $table->text("address_line1")->nullable();
            $table->text("address_line2")->nullable();
            $table->string("pincode")->nullable();
            $table->foreignId('city_id')->nullable()->constrained("cities")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('state_id')->nullable()->constrained("states")->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("lat")->nullable();
            $table->string("long")->nullable();
            $table->string("profile_photo")->nullable();

            //bank account details
            $table->string("account_person_name")->nullable();
            $table->string("bank_name")->nullable();
            $table->string("account_number")->nullable();
            $table->string("ifsc_code")->nullable();
            $table->datetime("signup_date_time")->nullable();
            $table->string("is_admin_approve")->default((AdminApproveEnums::PENDING_APPROVAL)->value);
            $table->text("rejection_reason")->nullable();
            $table->longText("terms_and_condition")->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coaching_centres');
    }
};
