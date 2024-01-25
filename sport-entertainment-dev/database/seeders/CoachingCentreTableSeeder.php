<?php

namespace Database\Seeders;

use App\Enums\AdminApproveEnums;
use App\Enums\StatusEnums;
use App\Models\CoachingCentre;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class CoachingCentreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        CoachingCentre::truncate();
        Schema::enableForeignKeyConstraints();

        $centres =
            [
                [
                    "id"                  => get_unique_string(),
                    "first_name"          => "Testuser",
                    "last_name"           => "First",
                    "email"               => "test1@gmail.com",
                    "mobile_number"       => "1234567890",
                    "password"            => Hash::make("12345678"),
                    "coaching_name"       => "Eklavya sports academy",
                    "logo"                => "",
                    "location_name"       => 'At Thaltej',
                    "experience"          => 5,
                    "bio"                 => "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before.",
                    "facility"            => "1,2,3",
                    "contact_number"      => "1234567891",
                    "contact_email"       => "coaching@yopmail.com",
                    "city_id"             => "45272",
                    "state_id"            => "1601",
                    "address_line1"       => "Tulip Bungllow Rd",
                    "address_line2"       => "Near Enigma Tower, Thaltej",
                    "pincode"             => "380054",
                    "lat"                 => "42.67",
                    "long"                => "45.34",
                    "profile_photo"       => "",
                    "account_person_name" => "Test Person Name",
                    "bank_name"           => "BOB Bank",
                    "account_number"      => "123456789",
                    "ifsc_code"           => "BOB123",
                    "signup_date_time"    => Carbon::parse('2020-01-01'),
                    "is_admin_approve"    => (AdminApproveEnums::PENDING_APPROVAL)->value,
                    "rejection_reason"    => "",
                    "terms_and_condition" => "Terms and Conditions",
                ],
                [
                    "id"                  => get_unique_string(),
                    "first_name"          => "Testuser",
                    "last_name"           => "Second",
                    "email"               => "test2@gmail.com",
                    "mobile_number"       => "7070707070",
                    "password"            => Hash::make("12345678"),
                    "coaching_name"       => "Aim sports academy",
                    "logo"                => "",
                    "location_name"       => 'At Isskon',
                    "experience"          => 7,
                    "bio"                 => "Coach Test at Aim sports academy has topped NIS in India. He is a B grade in Table Tennis and also a medalist in the 1st Veterans international hammer & shot put. He has also participated in various other throwing events.",
                    "facility"            => "4,5,6",
                    "contact_number"      => "1234567891",
                    "contact_email"       => "coaching2@yopmail.com",
                    "city_id"             => "45272",
                    "state_id"            => "1601",
                    "address_line1"       => "Isscon cross road",
                    "address_line2"       => "Near Isscon mandir,Ahmedabad",
                    "pincode"             => "380054",
                    "lat"                 => "42.67",
                    "long"                => "45.34",
                    "profile_photo"       => "",
                    "account_person_name" => "Test Second Person Name",
                    "bank_name"           => "BOB Bank",
                    "account_number"      => "123456789",
                    "ifsc_code"           => "BOB123",
                    "signup_date_time"    => Carbon::parse('2020-01-01'),
                    "is_admin_approve"    => (AdminApproveEnums::PENDING_APPROVAL)->value,
                    "rejection_reason"    => "",
                    "terms_and_condition" => "Terms and Conditions",
                ],
            ];

        CoachingCentre::insert($centres);
    }
}
