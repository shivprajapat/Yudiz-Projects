<?php

namespace Database\Seeders;

use App\Models\Sports;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CountriesTableSeeder::class,
            StatesTableSeeder::class,
            CityForIndiaSeeder::class,
            UserTableSeeder::class,
            FacilitiesTableSeeder::class,
            AgeGroupSeeder::class,
            SportSeeder::class,
            CoachingCentreTableSeeder::class,
            CoachingCentreOfferedSports::class,
            BatchSeeder::class,
            ContentsTableSeeder::class,
            BookingSeeder::class,
            UserParticipantTableSeeder::class,
            BookingParticipantSeeder::class,
            UserFavoriteSports::class,
        ]);

        // Admin Dependent Seeders
        $this->call([
            AdminsTableSeeder::class,
            SectionsTableSeeder::class,
            RolesTableSeeder::class,
            SettingsTableSeeder::class,
            CmsPagesTableSeeder::class,
        ]);
    }
}
