<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // dd($this->start_date);
        return [
            "custom_booking_id"    => $this->id,
            "coaching_centre_name" => $this->coaching_name,
            "address_line1"        => $this->address_line1,
            "address_line2"        => $this->address_line2,
            "pincode"              => $this->pincode,
            "booking_id"           => $this->booking_id,
            "sport_name"           => $this->sport_name,
            "batch_name"           => $this->batch_name,
            "batch_start_date"     => $this->batch_start_date,
            "batch_end_date"       => $this->batch_end_date,
            "price"                => $this->price,
        ];
    }
}
