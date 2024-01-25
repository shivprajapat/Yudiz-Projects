<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory,HasUuids;

    protected $fillable = ['user_id','batch_id','coaching_centre_id','transaction_id','transaction_date','transaction_time','total_amount','commission','amount_paid_to_owner',
                            'payment_status_end_user','payment_transfer_status'];

    public  function user() {
        return $this->belongsTo(User::class,'user_id','id');
    }
    public  function batch() {
        return $this->belongsTo(Batch::class,'batch_id','id');
    }
    public  function coachingCentre() {
        return $this->belongsTo(CoachingCentre::class,'coaching_centre_id','id');
    }
}
