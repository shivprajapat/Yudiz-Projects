<?php

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
        Schema::create("cities", function (Blueprint $table) {
            $table->id();

            $table->foreignId("country_id")->nullable()->constrained("countries")->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId("state_id")->nullable()->constrained("states")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string("name")->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("cities");
    }
};
