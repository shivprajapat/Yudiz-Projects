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
        Schema::create("sections", function (Blueprint $table) {
            $table->id();

            $table->string("name")->nullable();
            $table->string("grouping_name")->nullable();
            $table->string("icon")->nullable();
            $table->string("image")->nullable();
            $table->string("icon_type")->nullable()->comment("Icon or Image"); // icon or image
            $table->integer("sequence")->nullable();
            $table->string("is_active")->nullable();

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
        Schema::dropIfExists("sections");
    }
};
