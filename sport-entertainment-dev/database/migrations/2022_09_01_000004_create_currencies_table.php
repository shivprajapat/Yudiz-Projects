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
        Schema::create("currencies", function (Blueprint $table) {
            $table->id();

            $table->foreignId("country_id")->nullable()->constrained("countries")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string("name")->nullable();
            $table->string("iso3")->nullable();
            $table->string("precision")->nullable();
            $table->string("symbol")->nullable();
            $table->string("symbol_native")->nullable();
            $table->string("symbol_first")->nullable();
            $table->string("decimal_mark")->nullable();
            $table->string("thousands_separator")->nullable();

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
        Schema::dropIfExists("currencies");
    }
};
