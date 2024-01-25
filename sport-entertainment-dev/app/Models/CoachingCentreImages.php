<?php

namespace App\Models;

use App\Traits\UUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachingCentreImages extends Model
{
    use HasFactory,UUID;

    protected $fillable = [
        'id', 'coaching_centre_id', 'image_path','is_banner','is_active'
    ];

    public function coachingCentre()
    {
         return $this->belongsTo(CoachingCentre::class);
    }

}
