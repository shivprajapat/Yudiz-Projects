<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class SettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Setting::truncate();
        Schema::enableForeignKeyConstraints();

        $settings = [
            [
                "label"         =>  "Site Logo",
                "type"          =>  "file",
                "constant"      =>  "site_logo",
                "options"       =>  NULL,
                "class"         =>  "img_class",
                "icon"          =>  "fa fa-upload",
                "required"      =>  "n",
                "value"         =>  NULL,
                "hint"          =>  "Site logo which you want to display",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(1),
                "updated_at"    =>  now()->addSeconds(1),
            ],
            [
                "label"         =>  "Email",
                "type"          =>  "email",
                "constant"      =>  "support_email",
                "options"       =>  NULL,
                "class"         =>  "email_class",
                "icon"          =>  "fas fa-envelope",
                "required"      =>  "y",
                "value"         =>  "support@test.com",
                "hint"          =>  "Enter Support Email",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(2),
                "updated_at"    =>  now()->addSeconds(2),
            ],
            [
                "label"         =>  "Contact Number",
                "type"          =>  "text",
                "constant"      =>  "support_contact",
                "options"       =>  NULL,
                "class"         =>  "phone_class",
                "icon"          =>  "fas fa-phone-alt",
                "required"      =>  "y",
                "value"         =>  "1234567890",
                "hint"          =>  "Enter Support Contact",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(3),
                "updated_at"    =>  now()->addSeconds(3),
            ],
            [
                "label"         =>  "Full Address",
                "type"          =>  "textarea",
                "constant"      =>  "f_address",
                "options"       =>  NULL,
                "class"         =>  "full_address",
                "icon"          =>  "fa fa-map-marker-alt",
                "required"      =>  "y",
                "value"         =>  "1234567890",
                "hint"          =>  "Enter Address",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(3),
                "updated_at"    =>  now()->addSeconds(3),
            ],
            [
                "label"         =>  "Copy Right",
                "type"          =>  "text",
                "constant"      =>  "footer_text",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fas fa-copyright",
                "required"      =>  "y",
                "value"         =>  "&copy; {{YEAR}} " . env("APP_NAME") . ". All Rights Reserved",
                "hint"          =>  "Enter Copayright",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(4),
                "updated_at"    =>  now()->addSeconds(4),
            ],
            [
                "label"         =>  "Facebook",
                "type"          =>  "text",
                "constant"      =>  "facebook",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fab fa-facebook-f",
                "required"      =>  "n",
                "value"         =>  "https://www.facebook.com",
                "hint"          =>  "Enter Facebook Page Link",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(5),
                "updated_at"    =>  now()->addSeconds(5),
            ],
            [
                "label"         =>  "Twitter",
                "type"          =>  "text",
                "constant"      =>  "twitter",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fab fa-twitter",
                "required"      =>  "n",
                "value"         =>  "https://www.twitter.com",
                "hint"          =>  "Enter Twitter Page Link",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(6),
                "updated_at"    =>  now()->addSeconds(6),
            ],
            [
                "label"         =>  "Instagram",
                "type"          =>  "text",
                "constant"      =>  "instagram",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fab fa-instagram",
                "required"      =>  "n",
                "value"         =>  "https://www.instagram.com",
                "hint"          =>  "Enter Instagram Page Link",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(7),
                "updated_at"    =>  now()->addSeconds(7),
            ],
            [
                "label"         =>  "Pinterest",
                "type"          =>  "text",
                "constant"      =>  "pinterest",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fab fa-pinterest",
                "required"      =>  "n",
                "value"         =>  "https://www.pinterest.com",
                "hint"          =>  "Enter Pinterest Page Link",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(8),
                "updated_at"    =>  now()->addSeconds(8),
            ],
            [
                "label"         =>  "Linkedin",
                "type"          =>  "text",
                "constant"      =>  "linkedin",
                "options"       =>  NULL,
                "class"         =>  NULL,
                "icon"          =>  "fab fa-linkedin-in",
                "required"      =>  "n",
                "value"         =>  "https://www.linkedin.com",
                "hint"          =>  "Enter Linkedin Page Link",
                "editable"      =>  "y",
                "created_at"    =>  now()->addSeconds(9),
                "updated_at"    =>  now()->addSeconds(9),
            ],
        ];

        Setting::insert($settings);

    }
}
