<?php

namespace Database\Seeders;

use App\Enums\PaymentStatusEnums;
use App\Models\Batch;
use App\Models\Booking;
use App\Models\CoachingCentre;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Booking::truncate();
        Schema::enableForeignKeyConstraints();
        $bookings = [
            [
                "id"                 => get_unique_string(),
                "user_id"            => User::first()->id,
                "batch_id"           => Batch::first()->id,
                "coaching_centre_id" => CoachingCentre::first()->id,
                "booking_id"         => 012345,
                "booking_date"       => "2023-10-11",
                "booking_time"       => "11:00 AM",
                "total_price"        => "200",
                "convenience_fees"   => "20",
                "payment_id"         => "RAZORPAY_ID",
                "no_of_participants" => 2,
                "payment_status"     => (PaymentStatusEnums::SUCCESS)->value,
                "created_at"         => now()->addSeconds(50),
                "updated_at"         => now()->addSeconds(50),
            ],
            [
                "id"                 => get_unique_string(),
                "user_id"            => User::first()->id,
                "batch_id"           => Batch::first()->id,
                "coaching_centre_id" => CoachingCentre::first()->id,
                "booking_id"         => 01123,
                "booking_date"       => "2021-01-28",
                "booking_time"       => "11:59 AM",
                "total_price"        => "250",
                "convenience_fees"   => "25",
                "payment_id"         => "RAZORPAY_ID_2",
                "no_of_participants" => 2,
                "payment_status"     => (PaymentStatusEnums::FAILED)->value,
                "created_at"         => now()->addSeconds(50),
                "updated_at"         => now()->addSeconds(50),
            ],
            [
                "id"                 => get_unique_string(),
                "user_id"            => User::first()->id,
                "batch_id"           => Batch::first()->id,
                "coaching_centre_id" => CoachingCentre::first()->id,
                "booking_id"         => 023456,
                "booking_date"       => "2021-05-30",
                "booking_time"       => "07:00 PM",
                "total_price"        => "300",
                "convenience_fees"   => "30",
                "payment_id"         => "RAZORPAY_ID_3",
                "no_of_participants" => 2,
                "payment_status"     => PaymentStatusEnums::SUCCESS,
                "created_at"         => now()->addSeconds(50),
                "updated_at"         => now()->addSeconds(50),
            ],
            [
                "id"                 => get_unique_string(),
                "user_id"            => User::first()->id,
                "batch_id"           => Batch::first()->id,
                "coaching_centre_id" => CoachingCentre::first()->id,
                "booking_id"         => 012345,
                "booking_date"       => "2020-05-15",
                "booking_time"       => "06:00 PM",
                "total_price"        => "600",
                "convenience_fees"   => "60",
                "payment_id"         => "RAZORPAY_ID_4",
                "no_of_participants" => 2,
                "payment_status"     => PaymentStatusEnums::SUCCESS,
                "created_at"         => now()->addSeconds(50),
                "updated_at"         => now()->addSeconds(50),
            ],

        ];
        Booking::insert($bookings);
    }
}
