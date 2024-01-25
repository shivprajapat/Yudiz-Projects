<?php

use App\Enums\FaqTypeEnums;
use App\Enums\StatusEnums;
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
        Schema::create("faqs", function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string("title");
            $table->text("description");
            $table->string("faq_type")->default(Null);
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);
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
        Schema::dropIfExists("faqs");
    }
};
