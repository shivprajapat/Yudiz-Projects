<?php

namespace App\Models;

use App\Traits\QeueryScopeTrait;
use App\Traits\UUID;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory, UUID,  QeueryScopeTrait;
    protected $fillable = [
        'coaching_centre_id', 'name', 'start_date', 'end_date', 'sport_id', 'age_id', 'batch_size', 'booked_batch_size', 'session_days', 'start_time',
        'end_time', 'number_of_session', 'price', 'actual_price', 'brief_details', 'live_status', 'is_active', 'completion_status',
    ];

    public function coachingCentre()
    {
        return $this->belongsTo(CoachingCentre::class);
    }
    public function sport()
    {
        return $this->belongsTo(Sports::class);
    }
    public function ageGroup()
    {
        return $this->belongsTo(AgeGroup::class, 'age_id', 'id');
    }

    protected function startDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Carbon::parse($value)->format("d/m/Y"),
        );
    }
    protected function endDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Carbon::parse($value)->format("d/m/Y"),
        );
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    function checkAvailabelSeat()
    {
        $availabelSeat = $this->batch_size - $this->booked_batch_size;
        return $availabelSeat;
    }
    function getExtraMsg()
    {
        $msg = null;
        $seatCount = $this->checkAvailabelSeat();
        if ($seatCount <= 3) {
            $msg =  "Only $seatCount is left.";
        }
        return $msg;
    }
    function isHouseFullBatch()
    {
        $return = false;
        $seatCount = $this->checkAvailabelSeat();
        if ($seatCount === 0) {
            $return = true;
        }
        return $return;
    }

    function getStartDateEndDate()
    {
        return Carbon::createFromFormat("d/m/Y", $this->start_date)->format('jS M')  . " to " .  Carbon::createFromFormat("d/m/Y", $this->end_date)->format('jS  Y');
    }
    function getWebStartDateEndDate()
    {
        return $this->start_date . " | " . $this->end_date;
    }
    function getStartTimeEndTime()
    {
        return $this->start_time . " - " . $this->end_time;
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    function switchAbleToOff()
    {
        $isDisable = false;
        $complitionStatus = $this->completion_status;
        if ($complitionStatus == "0" && $this->live_status == "1") {
            $isDisable = true;
        }
        return $isDisable;
    }

    function ableToDelete()
    {
        $ableToDelete = true;
        if ($this->completion_status == "0" &&  $this->live_status == "1") {
            $ableToDelete = false;
        }
        return $ableToDelete;
    }

    function ableToEdit()
    {
        $ableToEdit = false;
        if ($this->completion_status == "0" &&  $this->live_status == "0") {
            $ableToEdit = true;
        }
        return $ableToEdit;
    }
}
