<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Enums\GenderEnum;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        $users = [
            [
                'custom_id'      => get_unique_string(),
                'first_name'     => 'Test',
                'last_name'      => 'First',
                'mobile_number'  => '1234567890',
                'email'          => 'test1234@yopmail.com',
                'gender'         => GenderEnum::MALE,
                'dob'            => '2002-05-02',
                'is_active'      => '1',
                "state_id"       => '1601',
                "city_id"        => '45308',
                "address_line_1" => "Himalaya Mall Near",
                "address_line_2" => "Thaltej",
                "pin_code"       => '364710'
            ],
            [
                'custom_id'      => get_unique_string(),
                'first_name'     => 'Test',
                'last_name'      => 'Last',
                'mobile_number'  => '1234567891',
                'email'          => 'test123@yopmail.com',
                'gender'         => GenderEnum::FEMALE,
                'dob'            => '2010-05-02',
                'is_active'      => '1',
                "state_id"       => '1601',
                "city_id"        => '45308',
                "address_line_1" => "Himalaya Mall Near",
                "address_line_2" => "Thaltej",
                "pin_code"       => '364710'
            ]
        ];

        User::insert($users);
    }
}
