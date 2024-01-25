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
        Schema::create("languages", function (Blueprint $table) {
            $table->id();

            $table->string("iso2")->nullable();
            $table->string("name")->nullable();
            $table->string("name_native")->nullable();
            $table->string("dir")->nullable();

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
        Schema::dropIfExists("languages");
    }
};
