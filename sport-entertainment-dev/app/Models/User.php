<?php

namespace App\Models;

use App\Enums\GenderEnum;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = "users";

    public function getRouteKeyName()
    {
        return "custom_id";
    }

    protected $fillable = [
        "custom_id",
        "first_name",
        "last_name",
        "mobile_number",
        "email",
        "gender",
        "dob",
        "otp",
        "otp_expire",
        "ip_address",
        "profile_photo",
        "is_active",
        "payment_id",
        "password",
        "remember_token",
        "email_verified_at",
        "state_id",
        "city_id",
        "address_line_1",
        "address_line_2",
        "pin_code",
    ];

    protected $hidden = [
        "password", "remember_token",
    ];

    protected $casts = [
        "email_verified_at" => "datetime",
        'gender' => GenderEnum::class,
    ];

    public function getTokenName()
    {
        return str_slug(config("utility.api.token_name") . " user");
    }

    public function getHeaderName()
    {
        return trim(collect(explode(" ", config("utility.api.auth_token_name")))->map(function ($segment) {
            return ucfirst($segment);
        })->prepend("X")->join("-"));
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }


    function getFullName()
    {
        return $this->first_name . " " . $this->last_name;
    }

    function getGender()
    {
        return $this->gender == GenderEnum::MALE ? __("MALE") : __("FEMALE");
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function device()
    {
        return $this->hasOne(DeviceToken::class);
    }
    public function state()
    {
        return $this->belongsTo(State::class);
    }
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function favoriteSports()
    {
        return $this->belongsToMany(Sports::class, 'user_favorite_sports', 'user_id', 'sport_id');
    }

    function generateSanctumToken()
    {
        return $this->createToken('auth_token')->plainTextToken;
    }
}
