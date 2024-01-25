<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class AgeGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        AgeGroup::truncate();
        Schema::enableForeignKeyConstraints();

        $ageGroups = [
            [
                'id'          => get_unique_string(),
                'age_name'    => "All Level",
                'minimum_age' => "1",
                'maximum_age' => "100",
                "created_at"  => now()->addSeconds(10),
                "updated_at"  => now()->addSeconds(10),
            ],
            [
                'id'          => get_unique_string(),
                'age_name'    => "3 to 6 Year",
                'minimum_age' => "3",
                'maximum_age' => "6",
                "created_at"  => now()->addSeconds(15),
                "updated_at"  => now()->addSeconds(15),
            ],
            [
                'id'          => get_unique_string(),
                'age_name'    => "7 To 10 Year",
                'minimum_age' => "7",
                'maximum_age' => "10",
                "created_at"  => now()->addSeconds(20),
                "updated_at"  => now()->addSeconds(20),
            ],
            [
                'id'          => get_unique_string(),
                'age_name'    => "11 To 15 Year",
                'minimum_age' => "11",
                'maximum_age' => "15",
                "created_at"  => now()->addSeconds(25),
                "updated_at"  => now()->addSeconds(25),
            ],
            [
                'id'          => get_unique_string(),
                'age_name'    => "16 To 18 Year",
                'minimum_age' => "16",
                'maximum_age' => "18",
                "created_at"  => now()->addSeconds(30),
                "updated_at"  => now()->addSeconds(30),
            ],
            [
                'id'          => get_unique_string(),
                'age_name'    => "18+ Year",
                'minimum_age' => "18",
                'maximum_age' => "100",
                "created_at"  => now()->addSeconds(35),
                "updated_at"  => now()->addSeconds(35),
            ],
        ];
        AgeGroup::insert($ageGroups);
    }
}
