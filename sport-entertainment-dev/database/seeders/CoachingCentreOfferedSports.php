<?php

namespace Database\Seeders;

use App\Models\{CoachingCentre, CoachingCentreOfferedSport, Sports};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CoachingCentreOfferedSports extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        CoachingCentreOfferedSport::truncate();
        Schema::enableForeignKeyConstraints();

        $offeredSports = [
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
            [
                "id"                 => get_unique_string(),
                "coaching_centre_id" => CoachingCentre::inRandomOrder()->first()->id,
                "sport_id"           => Sports::inRandomOrder()->first()->id,
                'created_at'         => now()->addSeconds(44710),
                'updated_at'         => now()->addSeconds(44710),
            ],
        ];
        CoachingCentreOfferedSport::insert($offeredSports);
    }
}
