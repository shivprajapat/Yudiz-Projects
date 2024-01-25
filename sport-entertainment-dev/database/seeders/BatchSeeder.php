<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use App\Models\Batch;
use App\Models\CoachingCentre;
use App\Models\Sports;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Batch::truncate();
        Schema::enableForeignKeyConstraints();

        $batchGroup = [
            [
                'id'                 => get_unique_string(),
                'coaching_centre_id' => CoachingCentre::first()->id,
                'name'               => "Morning Batch Test",
                'start_date'         => "2023-06-28",
                'end_date'           => "2023-08-30",
                'sport_id'           => Sports::inRandomOrder()->first()->id,
                'age_id'             => AgeGroup::inRandomOrder()->first()->id,
                'batch_size'         => "15",
                'booked_batch_size'  => "5",
                'session_days'       => "Monday,Tuesday,Wednesday",
                'start_time'         => "2:00 PM",
                'end_time'           => "4:00 PM",
                'number_of_session'  => "100",
                'price'              => "220",
                'actual_price'       => "200",
                'brief_details'      => "This is morning batch for testing",
                'live_status'        => "0",
                'completion_status'  => null,
                "created_at"         => now()->addSeconds(10),
                "updated_at"         => now()->addSeconds(10),
            ],
            [
                'id'                 => get_unique_string(),
                'coaching_centre_id' => CoachingCentre::first()->id,
                'name'               => "Pirates Batch Test",
                'start_date'         => "2023-06-30",
                'end_date'           => "2023-08-8",
                'sport_id'           => Sports::inRandomOrder()->first()->id,
                'age_id'             => AgeGroup::inRandomOrder()->first()->id,
                'batch_size'         => "20",
                'booked_batch_size'  => "18",
                'session_days'       => "Monday,Tuesday,Thursday",
                'start_time'         => "1:00 PM",
                'end_time'           => "3:00 PM",
                'number_of_session'  => "70",
                'price'              => "220",
                'actual_price'       => "200",
                'brief_details'      => "This batch for testing Pirates",
                'live_status'        => "0",
                'completion_status'  => null,
                "created_at"         => now()->addSeconds(10),
                "updated_at"         => now()->addSeconds(10),
            ],
            [
                'id'                 => get_unique_string(),
                'coaching_centre_id' => CoachingCentre::first()->id,
                'name'               => "Samurai Test",
                'start_date'         => "2023-09-30",
                'end_date'           => "2023-10-15",
                'sport_id'           => Sports::inRandomOrder()->first()->id,
                'age_id'             => AgeGroup::inRandomOrder()->first()->id,
                'batch_size'         => "20",
                'booked_batch_size'  => "18",
                'session_days'       => "Sunday,Saturday",
                'start_time'         => "1:00 PM",
                'end_time'           => "3:00 PM",
                'number_of_session'  => "70",
                'price'              => "220",
                'actual_price'       => "200",
                'brief_details'      => "This batch for testing samurai",
                'live_status'        => "0",
                'completion_status'  => null,
                "created_at"         => now()->addSeconds(10),
                "updated_at"         => now()->addSeconds(10),
            ],
        ];
        Batch::insert($batchGroup);
    }
}
