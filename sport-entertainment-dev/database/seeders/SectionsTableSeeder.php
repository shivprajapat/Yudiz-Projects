<?php

namespace Database\Seeders;

use App\Models\Section;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class SectionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Section::truncate();
        Schema::enableForeignKeyConstraints();

        $sections = [
            [
                "name"          =>  "Dashboard",
                "grouping_name" =>  "Dashboard",
                "icon"          =>  "fas fa-home",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  1,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(1),
                "updated_at"    =>  now()->addSeconds(1),
            ],
            [
                "name"          =>  "Users",
                "grouping_name" =>  "User Management",
                "icon"          =>  "fas fa-users",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  2,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(2),
                "updated_at"    =>  now()->addSeconds(2),
            ],
            [
                "name"          =>  "Manage Coaching Centres",
                "grouping_name" =>  "Coaching Centres Management",
                "icon"          =>  "fa-solid fa-medal",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  3,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(3),
                "updated_at"    =>  now()->addSeconds(3),
            ],
            [
                "name"          =>  "Manage Batches",
                "grouping_name" =>  "Batches Management",
                "icon"          =>  "fa-solid fa-files",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  4,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(4),
                "updated_at"    =>  now()->addSeconds(4),
            ],
            [
                "name"          =>  "Manage Bookings",
                "grouping_name" =>  "Bookings Management",
                "icon"          =>  "fa fa-calendar",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  5,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(5),
                "updated_at"    =>  now()->addSeconds(5),
            ],
            [
                "name"          =>  "Manage Reviews",
                "grouping_name" =>  "Reviews Management",
                "icon"          =>  "fa fa-calendar",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  6,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(6),
                "updated_at"    =>  now()->addSeconds(6),
            ],
            [
                "name"          =>  "Manage Payments",
                "grouping_name" =>  "Payments Management",
                "icon"          =>  "fa fa-calendar",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  7,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(7),
                "updated_at"    =>  now()->addSeconds(7),
            ],

            [
                "name"          =>  "Manage Dropdown Values",
                "grouping_name" =>  "Dropdown Values Management",
                "icon"          =>  "fa fa-th-list",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  8,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(8),
                "updated_at"    =>  now()->addSeconds(8),
            ],
            [
                "name"          =>  "Manage Push Notifications",
                "grouping_name" =>  "Push Notifications Management",
                "icon"          =>  "fab fa-product-hunt",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  9,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(9),
                "updated_at"    =>  now()->addSeconds(9),
            ],
            [
                "name"          =>  "Manage FAQs",
                "grouping_name" =>  "FAQs Management",
                "icon"          =>  "fa fa-question-circle",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  10,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(11),
                "updated_at"    =>  now()->addSeconds(11),
            ],
            [
                "name"          =>  "Manage Banner Images",
                "grouping_name" =>  "Banner Images Management",
                "icon"          =>  "fa fa-question-circle",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  11,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(11),
                "updated_at"    =>  now()->addSeconds(11),
            ],
            [
                "name"          =>  "Manage Contents",
                "grouping_name" =>  "Content Management",
                "icon"          =>  "fa fa-money",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  12,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(12),
                "updated_at"    =>  now()->addSeconds(12),
            ],
             [
                "name"          =>  "Settings",
                "grouping_name" =>  "Site Settings",
                "icon"          =>  "fas fa-cog",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  13,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(13),
                "updated_at"    =>  now()->addSeconds(13),
            ],
            [
                "name"          =>  "CMS",
                "grouping_name" =>  "Content Management",
                "icon"          =>  "fas fa-book",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  14,
                "is_active"     =>  "y",
                "created_at"    =>  now()->addSeconds(14),
                "updated_at"    =>  now()->addSeconds(14),
            ],
            [
                'name'          =>  'Countries',
                "grouping_name" =>  "Countries Management",
                'icon'          =>  'fas fa-flag',
                'image'         =>  '',
                'icon_type'     =>  'font-awesome',
                'sequence'      =>  15,
                'is_active'     => 'n',
                'created_at'    => \Carbon\Carbon::now(15),
                'updated_at'    => \Carbon\Carbon::now(15),
            ],
            [
                'name'          =>  'States',
                "grouping_name" =>  "States Management",
                'icon'          =>  'la la-flag',
                'image'         =>  '',
                'icon_type'     =>  'other',
                'sequence'      =>  16,
                'is_active'     => 'n',
                'created_at'    => \Carbon\Carbon::now(16),
                'updated_at'    => \Carbon\Carbon::now(16),
            ],
            [
                'name'          =>  'Cities',
                "grouping_name" =>  "Cities Management",
                'icon'          =>  'la la-city',
                'image'         =>  '',
                'icon_type'     =>  'other',
                'sequence'      =>  17,
                'is_active'     => 'n',
                'created_at'    => \Carbon\Carbon::now(17),
                'updated_at'    => \Carbon\Carbon::now(17),
            ],
            [
                "name"          =>  "Role Management",
                "grouping_name" =>  "User Management",
                "icon"          =>  "fas fa-briefcase",
                "image"         =>  NULL,
                "icon_type"     =>  "icon", // icon or image
                "sequence"      =>  18,
                "is_active"     =>  "n",
                "created_at"    =>  now()->addSeconds(18),
                "updated_at"    =>  now()->addSeconds(18),
            ],

        ];

        $sections_chunks = array_chunk($sections, 2000);
        foreach ($sections_chunks as $section) {
            Section::insert($section);
        }
    }
}
