<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuickLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("quick_links", function (Blueprint $table) {
            $table->id();

            $table->foreignId("admin_id")->nullable()->constrained("admins")->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId("role_id")->nullable()->constrained("roles")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string("link_type");

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
        Schema::dropIfExists("quick_links");
    }
}
