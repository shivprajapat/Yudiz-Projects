<?php

use App\Enums\CmsTypeEnums;
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
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->nullable()->comment('FOR SPECIFIC TABLE COLUMN NAME');
            $table->string('value')->nullable()->comment('FOR SPECIFIC TABLE COLUMN VALUE');
            $table->string('user_type')->default((CmsTypeEnums::COACHING_CENTRE)->value);
            $table->string('subject')->nullable();
            $table->text("message")->nullable();
            $table->string('image')->nullable();
            $table->string('status')->nullable();  //show done status don't know why
            $table->string('type')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
