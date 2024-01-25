<?php

namespace Database\Seeders;

use App\Enums\CmsTypeEnums;
use App\Enums\StatusEnums;
use App\Models\CmsPage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CmsPagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        CmsPage::truncate();
        Schema::enableForeignKeyConstraints();

        $cms_pages = [
            [
                'id'          => get_unique_string(),
                "title"       => "About Us",
                "slug"        => "about-us",
                "description" => "<p>&nbsp; &nbsp; &nbsp;About Us</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(2),
                "updated_at"  => now()->addSeconds(2),
            ],
            [
                'id'          => get_unique_string(),
                "title"       => "Privacy Policy",
                "slug"        => "privacy-policy",
                "description" => "<p>&nbsp; &nbsp; &nbsp;Privacy</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(4),
                "updated_at"  => now()->addSeconds(4),
            ],
            [
                'id'          => get_unique_string(),
                "title"       => "Privacy Policy App",
                "slug"        => "app-privacy-policy",
                "description" => "<p>&nbsp; &nbsp; &nbsp;Privacy</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(4),
                "updated_at"  => now()->addSeconds(4),
            ],
            [
                'id'          => get_unique_string(),
                "title"       => "About Us App",
                "slug"        => "app-about-us",
                "description" => "<p>&nbsp; &nbsp; &nbsp;About Us</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(2),
                "updated_at"  => now()->addSeconds(2),
            ],
            [
                'id'          => get_unique_string(),
                "title"       => "Terms and Conditions App",
                "slug"        => "app-terms-and-conditions",
                "description" => "<p>&nbsp; &nbsp; &nbsp;Terms and Conditions</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(3),
                "updated_at"  => now()->addSeconds(3),
            ],
            [
                'id'          => get_unique_string(),
                "title"       => "Content Policies App",
                "slug"        => "app-content-policies",
                "description" => "<p>&nbsp; &nbsp; &nbsp;Content Policy for app</p>",
                "file"        => NULL,
                "is_active"   => StatusEnums::ACTIVE,
                "created_at"  => now()->addSeconds(3),
                "updated_at"  => now()->addSeconds(3),
            ],
        ];
        CmsPage::insert($cms_pages);
    }
}
