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
        Schema::create("roles", function (Blueprint $table) {
            $table->id();

            $table->foreignId("section_id")->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string("title")->nullable();
            $table->string("route")->nullable();
            $table->string("params")->nullable();
            $table->string("icon")->nullable();
            $table->string("image")->nullable();
            $table->string("icon_type")->nullable()->comment("Icon or Image"); // Icon or Image
            $table->string("sequence")->nullable();
            $table->string("is_active")->nullable();
            $table->tinyInteger("is_display")->nullable();
            $table->string("allowed_permissions")->nullable();

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
        Schema::dropIfExists("roles");
    }
};
