<?php

use App\Enums\AdminTypeEnums;
use App\Enums\StatusEnums;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("admins", function (Blueprint $table) {
            $table->id();

            $table->string("custom_id")->nullable();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->string("email")->unique();
            $table->string("password")->nullable();
            $table->string("contact_number")->nullable();
            $table->string("profile_photo")->nullable();
            $table->string("type")->default((AdminTypeEnums::MANAGER)->value);
            $table->text("permissions")->nullable();
            $table->tinyInteger("is_active")->default((StatusEnums::ACTIVE)->value);

            $table->timestamp("email_verified_at")->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("admins");
    }
}
