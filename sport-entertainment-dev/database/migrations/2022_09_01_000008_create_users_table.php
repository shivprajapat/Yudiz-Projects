<?php

use App\Enums\StatusEnums;
use App\Enums\User\UserStatusEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("users", function (Blueprint $table) {
            $table->id();
            $table->string("custom_id")->nullable();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->string("mobile_number")->nullable();
            $table->string("email")->unique()->nullable();
            $table->tinyInteger("gender")->nullable();
            $table->date("dob")->nullable();
            $table->integer("otp")->nullable();
            $table->dateTime("otp_expire")->nullable();
            $table->string("ip_address")->nullable();
            $table->string("profile_photo")->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::INACTIVE)->value);
            $table->string("payment_id")->nullable(); //if the customer have online payment and create payment id
            $table->foreignId('state_id')->nullable()->constrained("states")->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained("cities")->nullOnDelete();
            $table->string("address_line_1")->nullable();
            $table->string("address_line_2")->nullable();
            $table->string("pin_code")->nullable();

            //this id for payment gateway customer id
            // $table->string("password")->nullable();
            $table->timestamp("email_verified_at")->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("users");
    }
};
