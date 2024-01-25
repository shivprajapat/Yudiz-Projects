<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\QuickLink;
use App\Notifications\AdminResetPassword;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = "admins";

    protected $fillable = [
        "custom_id", "first_name", "last_name", "email", "password", "contact_number", "profile_photo", "type", "permissions", "is_active",
    ];

    protected $hidden = [
        "password", "remember_token",
    ];

    protected $casts = [
        "email_verified_at" => "datetime",
    ];

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new AdminResetPassword($token));
    }

    public function getAssetProfileAttribute()
    {
        return !empty($this->profile) ? asset("storage/".$this->profile) : asset("assets/admin/images/default_profile.jpg");
    }

    public function quickLinks()
    {
        return $this->hasMany(QuickLink::class, "admin_id", "id");
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

}
