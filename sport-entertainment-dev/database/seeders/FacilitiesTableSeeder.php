<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class FacilitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Facility::truncate();
        Schema::enableForeignKeyConstraints();

        $facilities = [
            [
                "name"       => 'Training Grounds',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Gymnasium',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Swimming Pool',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Indoor Sports Hall',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Science Lab',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Rehabilitation Center',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Equipment and Gear',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Video Analysis Room',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Lecture Rooms',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Locker Rooms and Showers',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Medical Center',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Outdoor Conditioning Area',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Specific Training Areas',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Cafeteria',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Changing Rooms',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Sports Equipment',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Coaching Staff',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Water Stations',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Restrooms',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],
            [
                "name"       => 'Parking',
                'created_at' => now()->addSeconds(1),
                'updated_at' => now()->addSeconds(1),
            ],

        ];

        Facility::insert($facilities);
    }
}
