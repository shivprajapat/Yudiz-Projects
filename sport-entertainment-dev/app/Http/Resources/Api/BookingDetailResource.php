<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "custom_batch_id"   => $this->custom_batch_id,
            "batch_name"        => $this->batch_name,
            "booking_id"        => $this->booking_id,
            "booking_date"      => $this->booking_date,
            "booking_time"      => $this->booking_time,
            "batch_start_date"  => $this->batch_start_date,
            "batch_end_date"    => $this->batch_end_date,
            "sport_name"        => $this->sport_name,
            "age_name"          => $this->age_name,
            "batch_size"        => $this->batch_size ?  $this->batch_size . __("MEMBERS") : NULL,
            "session_timing"    => $this->start_time . __("TO") . $this->end_time,
            "number_of_session" => $this->number_of_session,
            "session_days"      => $this->session_days,
            "total_price"       => $this->total_price,
            "convenience_fees"  => $this->convenience_fees,
        ];
    }
}
