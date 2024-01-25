<?php

namespace App\Models;

use App\Traits\UUID;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannerImage extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
       'id','coaching_centre_id', 'banner_image', 'banner_type','redirect_url','banner_note', 'is_active'
    ];

    public function coachingCentre(){
        return $this->belongsTo(CoachingCentre::class, 'coaching_centre_id','id');
    }
}
