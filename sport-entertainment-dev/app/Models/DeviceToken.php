<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceToken extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'coaching_centre_id','device_token', 'type', 'device_type', 'login_type'
    ];

    public function user(){return $this->belongsTo(User::class,'user_id','id'); }
    public function coachingCentre(){return $this->belongsTo(CoachingCentre::class,'coaching_centre_id','id'); }
}
