<?php

namespace Database\Seeders;

// use App\Enums\AdminTypeEnums;

use App\Enums\AdminTypeEnums;
use App\Enums\StatusEnums;
use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class AdminsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Admin::truncate();
        Schema::enableForeignKeyConstraints();

        $admins = [
            [
                "custom_id"         =>  get_unique_string("admins"),
                "first_name"        =>  "Super",
                "last_name"         =>  "Admin",
                "email"             =>  "admin@admin.com",
                "password"          =>  Hash::make("12345678"),
                "contact_number"    =>  "1234567890",
                "profile_photo"     =>  generate_avatar_icon("Super Admin"),
                "type"              =>  'admin',
                "permissions"       =>  serialize(get_permissions("admin")),
                "is_active"         =>  StatusEnums::ACTIVE,
                "created_at"        =>  now()->addSeconds(1),
                "updated_at"        =>  now()->addSeconds(1),
            ],
        ];

        Admin::insert($admins);
    }
}
