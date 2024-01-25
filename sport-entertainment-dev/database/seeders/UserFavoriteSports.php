<?php

namespace Database\Seeders;

use App\Models\Sports;
use App\Models\User;
use App\Models\UserFavoriteSport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserFavoriteSports extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $favoriteSports = [
            [
                "sport_id" => Sports::inRandomOrder()->first()->id,
                "user_id" => User::first()->id,
            ],
            [
                "sport_id" => Sports::inRandomOrder()->first()->id,
                "user_id" => User::first()->id,
            ],
            [
                "sport_id" => Sports::inRandomOrder()->first()->id,
                "user_id" => User::first()->id,
            ],
        ];

        UserFavoriteSport::insert($favoriteSports);
    }
}
