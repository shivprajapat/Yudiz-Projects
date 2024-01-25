<?php

namespace App\Models;

use App\Enums\PaymentStatusEnums;
use App\Traits\QeueryScopeTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuids, QeueryScopeTrait;
    protected $fillable = [
        'user_id',
        'batch_id',
        'booking_id',
        'booking_date',
        'booking_time',
        'total_price',
        'convenience_fees',
        'payment_id',
        'payment_status',
        "no_of_participants",
        "status"
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id', 'id');
    }

    function participants()
    {
        return $this->hasMany(BookingParticipant::class, 'booking_id', 'id');
    }

    protected $casts = [
        'payment_status' => PaymentStatusEnums::class,
    ];

    public static function generateBookingId()
    {
        return mt_rand(100000, 99999);
    }

    function scopePaymentStatusSuccess($query)
    {
        return $query->where("payment_status", PaymentStatusEnums::SUCCESS);
    }
}
