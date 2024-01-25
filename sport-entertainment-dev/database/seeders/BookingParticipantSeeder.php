<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingParticipant;
use App\Models\Participant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class BookingParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        BookingParticipant::truncate();
        Schema::enableForeignKeyConstraints();
        $bookingParticipant = [
            [
                "id"             => get_unique_string(),
                "booking_id"     => Booking::first()->id,
                "participant_id" => Participant::inRandomOrder()->first()->id,
                "created_at"     => now()->addSeconds(50),
                "updated_at"     => now()->addSeconds(50),
            ],
            [
                "id"             => get_unique_string(),
                "booking_id"     => Booking::first()->id,
                "participant_id" => Participant::inRandomOrder()->first()->id,
                "created_at"     => now()->addSeconds(50),
                "updated_at"     => now()->addSeconds(50),
            ],
            [
                "id"             => get_unique_string(),
                "booking_id"     => Booking::first()->id,
                "participant_id" => Participant::inRandomOrder()->first()->id,
                "created_at"     => now()->addSeconds(50),
                "updated_at"     => now()->addSeconds(50),
            ],
            [
                "id"             => get_unique_string(),
                "booking_id"     => Booking::first()->id,
                "participant_id" => Participant::inRandomOrder()->first()->id,
                "created_at"     => now()->addSeconds(50),
                "updated_at"     => now()->addSeconds(50),
            ],
        ];
        BookingParticipant::insert($bookingParticipant);
    }
}
