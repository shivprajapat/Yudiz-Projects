<?php

use App\Enums\CmsTypeEnums;
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
        Schema::create("cms_pages", function (Blueprint $table) {
            $table->uuid("id")->primary();

            // $table->foreignId("edited_by")->nullable()->constrained("admins")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string("title")->nullable();
            $table->string("slug")->nullable();
            $table->text("description")->nullable();
            $table->string("cms_type")->default((CmsTypeEnums::COACHING_CENTRE)->value);
            $table->string("file")->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::INACTIVE)->value);
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
        Schema::dropIfExists("cms_pages");
    }
};
