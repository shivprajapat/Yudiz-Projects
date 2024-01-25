<?php

use App\Enums\DeviceTypeEnums;
use App\Enums\FaqTypeEnums;
use App\Enums\UserTypeEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('device_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid("coaching_centre_id")->nullable()->constrained("coaching_centres")->cascadeOnDelete()->cascadeOnUpdate();
            $table->longText('device_token')->nullable();
            $table->string('type')->nullable();  //app, web
            $table->string('device_type')->nullable();  //web, android, ios
            $table->string('login_type')->nullable();  //coaching_centre , End_user
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_tokens');
    }
};
