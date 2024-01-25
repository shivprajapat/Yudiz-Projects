<?php

namespace App\Models;

use App\Enums\GenderEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingParticipant extends Model
{
    use HasFactory;
    function participant()
    {
        return $this->belongsTo(Participant::class, 'participant_id', 'id');
    }

    function participateAsUser()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    protected $casts = [
        'gender' => GenderEnum::class,
    ];

    function getGender() {
        return $this->gender == GenderEnum::MALE ? __("MALE") : __("FEMALE");
    }
}
