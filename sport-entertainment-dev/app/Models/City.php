<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class City extends Model
{
    use HasFactory;

    protected $table = "cities";

    protected $fillable = [
        "id", "country_id", "state_id", "name",
    ];

    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
    public function state() : BelongsTo
    {
        return $this->belongsTo(State::class);
    }
    public function coachingCentre()
    {
        $this->hasMany(CoachingCentre::class,'city_id','id');
    }
}
