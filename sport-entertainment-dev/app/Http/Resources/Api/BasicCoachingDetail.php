<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BasicCoachingDetail extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "coaching_centre_id"   => $this->id ?? null,
            "coaching_logo"        => generate_url($this->logo)  ?? null,
            "coaching_centre_name" => $this->coaching_name ?? null,
            "address_line1"        => $this->address_line1 ?? null,
            "address_line2"        => $this->address_line2 ?? null,
            "pin_code"             => $this->pincode ?? null,
            "review"               => 4.2,
            "total_review_count"   => 98
        ];
    }
}
