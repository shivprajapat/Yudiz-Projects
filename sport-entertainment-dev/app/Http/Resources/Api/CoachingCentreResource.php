<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoachingCentreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"             => $this->id,
            "logo"           => generate_url($this->logo),
            "coaching_name"  => $this->coaching_name,
            "address_line_1" => $this->address_line1,
            "address_line_2" => $this->address_line2,
            "city"           => $this->city ? $this->city->name : "",
            "state"           => $this->state ? $this->state->name : "",
            'review'         => $this->getCoachingCentreReview(),
            'review_count'   => $this->getTotalCountCoachingReview(),
            'bio'            => $this->bio,
            "experience"     => $this->experience,
            "distance"       => $this->getDistance(),
            'pincode'        => $this->pincode,
            // "offered_sports" => OfferedSportsResource::collection($this->offeredSports),
        ];
    }
}
