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
        Schema::create('participants', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->tinyInteger("gender")->nullable();
            $table->date("dob")->nullable();
            $table->string("school_name")->nullable();
            $table->string("profile_photo")->nullable();

            // $table->tinyInteger("is_same_address")->nullable(); //1=> yes, 0=> no
            // $table->tinyInteger("is_self")->nullable(); //1=> yes, 0=> no
            //address
            $table->foreignId('state_id')->nullable()->constrained("states")->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained("cities")->nullOnDelete();
            $table->string("address_line_1")->nullable();
            $table->string("address_line_2")->nullable();
            $table->string("pin_code")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
