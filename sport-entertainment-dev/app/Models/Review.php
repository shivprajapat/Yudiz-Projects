<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['user_id','coaching_centre_id','batch_id','review_post_date','review_post_time','rating','review','is_approved'];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
    public function coachingCentre()
    {
        return $this->belongsTo(CoachingCentre::class,'coaching_centre_id','id');
    }
    public function batch()
    {
        return $this->belongsTo(Batch::class,'batch_id','id');
    }


}
