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
        Schema::create("countries", function (Blueprint $table) {
            $table->id();

            $table->string("name")->nullable();
            $table->string("phone_code")->nullable();
            $table->string("iso2")->nullable();
            $table->string("iso3")->nullable();
            $table->string("region")->nullable();
            $table->string("subregion")->nullable();
            $table->string("flag_png")->nullable();
            $table->string("flag_svg")->nullable();
            $table->string("flag_emoji")->nullable();

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
        Schema::dropIfExists("countries");
    }
};
