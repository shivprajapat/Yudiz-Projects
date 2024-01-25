<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;
    protected $fillable = ["name"];

    public function coachingCentre()
    {
        return $this->hasMany(CoachingCentre::class,'facilities','id');
    }
}
