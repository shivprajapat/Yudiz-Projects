<?php

namespace Database\Seeders;

use App\Models\Content;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ContentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Content::truncate();
        Schema::enableForeignKeyConstraints();
        $data = [
            [
                'id'         => get_unique_string(),
                'title'      => 'Convenience Fee',
                'slug'       => 'convenience-fee',
                'content'    => '15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => get_unique_string(),
                'title'      => 'Commission %',
                'slug'       => 'commission',
                'content'    => '3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        Content::insert($data);
    }
}
