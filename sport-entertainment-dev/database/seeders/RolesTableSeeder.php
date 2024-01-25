<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Role::truncate();
        Schema::enableForeignKeyConstraints();

        $roles = [
            [
                "section_id"            =>  1,
                "title"                 =>  "Dashboard",
                "route"                 =>  "admin.dashboard.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-home",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  2,
                "title"                 =>  "Users",
                "route"                 =>  "admin.users.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-users",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  3,
                "title"                 =>  "Manage Coaching Centres",
                "route"                 =>  "admin.coaching-centres.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-medal",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  4,
                "title"                 =>  "Manage Batches",
                "route"                 =>  "admin.batches.index",
                "params"                =>  null,
                "icon"                  =>  "fa fa-tasks",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  5,
                "title"                 =>  "Manage Bookings",
                "route"                 =>  "admin.bookings.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-calendar-alt",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,edit",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  6,
                "title"                 =>  "Manage Reviews",
                "route"                 =>  "admin.reviews.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-star",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  7,
                "title"                 =>  "Manage Payments",
                "route"                 =>  "admin.transactions.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-money-bill",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,delete,edit",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  8,
                "title"                 =>  "Manage Sports",
                "route"                 =>  "admin.sports.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-skating",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  8,
                "title"                 =>  "Manage Age Groups",
                "route"                 =>  "admin.age-groups.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-user",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  2,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  9,
                "title"                 =>  "Manage Push Notifications",
                "route"                 =>  "admin.push-notifications.index",
                "params"                =>  null,
                "icon"                  =>  "fa fa-bell",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  2,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  10,
                "title"                 =>  "Manage FAQs",
                "route"                 =>  "admin.faqs.index",
                "params"                =>  null,
                "icon"                  =>  "fa fa-question-circle",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],

            [
                "section_id"            =>  11,
                "title"                 =>  "Manage Banner Images",
                "route"                 =>  "admin.banner-images.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-images",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  12,
                "title"                 =>  "Manage Contents",
                "route"                 =>  "admin.contents.index",
                "params"                =>  null,
                "icon"                  =>  "fa fa-percent",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "sequence"              =>  1,
                "is_active"             =>  1,
                "allowed_permissions"   =>  "access,edit",
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            =>  13,
                "title"                 =>  "Settings",
                "route"                 =>  "admin.settings.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-cog",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "sequence"              =>  1,
                "is_active"             =>  1,
                "allowed_permissions"   =>  "access",
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                "section_id"            => 14 ,
                "title"                 =>  "CMS",
                "route"                 =>  "admin.pages.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-book",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,edit",
                "sequence"              =>  1,
                "is_active"             =>  1,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],
            [
                'section_id'                => 15 ,
                'title'                     =>  'Countries',
                'route'                     =>  'admin.countries.index',
                'params'                    =>  '',
                'icon'                      =>  'fas fa-flag',
                'image'                     =>  '',
                'icon_type'                 =>  'font-awesome',
                'allowed_permissions'       =>  'access,add,edit,delete',
                'sequence'                  =>  1,
                'is_active'                 =>  1,
                'created_at'                => \Carbon\Carbon::now(),
                'updated_at'                => \Carbon\Carbon::now(),
            ],
            [
                'section_id'                => 16 ,
                'title'                     =>  'States',
                'route'                     =>  'admin.states.index',
                'params'                    =>  '',
                'icon'                      =>  'la la-flag',
                'image'                     =>  '',
                'icon_type'                 =>  'other',
                'allowed_permissions'       =>  'access,add,edit,delete',
                'sequence'                  =>  1,
                'is_active'                 =>  1,
                'created_at'                => \Carbon\Carbon::now(),
                'updated_at'                => \Carbon\Carbon::now(),
            ],
            [
                'section_id'                => 17 ,
                'title'                     =>  'Cities',
                'route'                     =>  'admin.cities.index',
                'params'                    =>  '',
                'icon'                      =>  'la la-city',
                'image'                     =>  '',
                'icon_type'                 =>  'other',
                'allowed_permissions'       =>  'access,add,edit,delete',
                'sequence'                  =>  1,
                'is_active'                 =>  1,
                'created_at'                => \Carbon\Carbon::now(),
                'updated_at'                => \Carbon\Carbon::now(),
            ],
            [
                "section_id"            => 18 ,
                "title"                 =>  "Role Management",
                "route"                 =>  "admin.roles.index",
                "params"                =>  null,
                "icon"                  =>  "fas fa-briefcase",
                "image"                 =>  null,
                "icon_type"             =>  "icon", // icon or image
                "allowed_permissions"   =>  "access,add,edit,delete",
                "sequence"              =>  1,
                "is_active"             =>  0,
                "created_at"            =>  now()->addSeconds(),
                "updated_at"            =>  now()->addSeconds(),
            ],

        ];

        $role_chunks = array_chunk($roles, 2000);
        foreach ($role_chunks as $role) {
            Role::insert($role);
        }

        if(!empty(get_permissions("admin"))) {
            Admin::where(["id" => 1])->update([ "permissions" => serialize(get_permissions("admin")) ]);
        }
    }
}
