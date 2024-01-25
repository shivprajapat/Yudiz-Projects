<?php

namespace App\Models;

use App\Traits\QeueryScopeTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachingCentreOfferedSport extends Model
{
    use HasFactory, HasUuids, QeueryScopeTrait;
    protected $fillable = ['sport_id', 'coaching_centre_id', 'created_at', 'updated_at'];
    protected $table = 'coaching_centre_offered_sports';

    public function sport()
    {
        return $this->belongsTo(Sports::class,'sport_id','id');
    }
}
