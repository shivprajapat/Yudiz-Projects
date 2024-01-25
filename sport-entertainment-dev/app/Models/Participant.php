<?php

namespace App\Models;

use App\Enums\GenderEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = ["id", "first_name", "user_id", "last_name", "gender", "dob", "school_name", "profile_photo", "state_id", "city_id", "address_line_1", "address_line_2", "pin_code", "is_same_address"];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    protected $casts = [
        'gender' => GenderEnum::class,
    ];

    function getFullName() {
        return $this->first_name . " " . $this->last_name;
    }

    function getGender() {
        return $this->gender == GenderEnum::MALE ? __("MALE") : __("FEMALE");
    }
}
