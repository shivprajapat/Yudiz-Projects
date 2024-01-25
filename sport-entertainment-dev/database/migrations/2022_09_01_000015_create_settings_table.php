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
        Schema::create("settings", function (Blueprint $table) {
            $table->id();

            $table->string("label")->nullable();
            $table->string("type")->nullable();
            $table->string("constant")->nullable();
            $table->string("options")->nullable();
            $table->string("class")->nullable();
            $table->string("icon")->nullable();
            $table->string("required")->nullable();
            $table->string("value")->nullable();
            $table->string("hint")->nullable();
            $table->string("editable")->nullable();
            $table->softDeletes();

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
        Schema::dropIfExists("settings");
    }
};
