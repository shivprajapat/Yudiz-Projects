<?php

namespace Database\Seeders;

use App\Enums\GenderEnum;
use App\Models\{Participant,User};
use Illuminate\Database\Seeder;

class UserParticipantTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userParticipants = [
            [
                "id"             => get_unique_string(),
                "user_id"        => User::first()->id,
                "first_name"     => "Payel",
                "last_name"      => "Patel",
                "gender"         => GenderEnum::FEMALE,
                "dob"            => "2015-06-10",
                "school_name"    => "Sharda school",
                "state_id"       => "1601",
                "city_id"        => "45272",
                "address_line_1" => "Isscon cross road",
                "address_line_2" => "Near Isscon mandir,Ahmedabad",
                "pin_code"       => "380054",
            ],
            [
                "id"             => get_unique_string(),
                "user_id"        => User::first()->id,
                "first_name"     => "Tirth",
                "last_name"      => "Patel",
                "gender"         => GenderEnum::MALE,
                "dob"            => "2018-06-10",
                "school_name"    => "Saint Xavier School",
                "state_id"       => "1601",
                "city_id"        => "45272",
                "address_line_1" => "Isscon cross road",
                "address_line_2" => "Near Isscon mandir,Ahmedabad",
                "pin_code"       => "380054",
            ],
            [
                "id"             => get_unique_string(),
                "user_id"        => User::first()->id,
                "first_name"     => "Richa",
                "last_name"      => "Patel",
                "gender"         => GenderEnum::FEMALE,
                "dob"            => "2002-06-10",
                "school_name"    => "MD shah vidhyalaya",
                "state_id"       => "1601",
                "city_id"        => "45272",
                "address_line_1" => "Isscon cross road",
                "address_line_2" => "Near Isscon mandir,Ahmedabad",
                "pin_code"       => "380054",
            ],
        ];

        Participant::insert($userParticipants);
    }
}
