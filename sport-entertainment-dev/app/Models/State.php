<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    use HasFactory;

    protected $table = "states";

    protected $fillable = [
        "id", "country_id", "name",
    ];

    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function cities() : HasMany
    {
        return $this->hasMany(City::class);
    }
    public function coachingCentre()
    {
        $this->hasMany(CoachingCentre::class,'state_id','id');
    }
}
