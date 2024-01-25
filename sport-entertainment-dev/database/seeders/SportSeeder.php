<?php

namespace Database\Seeders;

use App\Models\Sports;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Sports::truncate();
        Schema::enableForeignKeyConstraints();

        $facilities = [
            [
                "id"         => get_unique_string(),
                "name"       => 'Cricket',
                'created_at' => now()->addSeconds(44700),
                'updated_at' => now()->addSeconds(44700),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Badminton',
                'created_at' => now()->addSeconds(44705),
                'updated_at' => now()->addSeconds(44705),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Carrom',
                'created_at' => now()->addSeconds(44710),
                'updated_at' => now()->addSeconds(44710),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Table Tennis',
                'created_at' => now()->addSeconds(44712),
                'updated_at' => now()->addSeconds(44712),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Football',
                'created_at' => now()->addSeconds(44713),
                'updated_at' => now()->addSeconds(44713),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Volleball',
                'created_at' => now()->addSeconds(44720),
                'updated_at' => now()->addSeconds(44720),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Pool',
                'created_at' => now()->addSeconds(44722),
                'updated_at' => now()->addSeconds(44722),
            ],
            [
                "id"         => get_unique_string(),
                "name"       => 'Hockey',
                'created_at' => now()->addSeconds(44725),
                'updated_at' => now()->addSeconds(44725),
            ],
        ];
        Sports::insert($facilities);
    }
}
