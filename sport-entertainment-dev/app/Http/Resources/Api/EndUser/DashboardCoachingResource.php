<?php

namespace App\Http\Resources\Api\EndUser;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardCoachingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        //if offered sport is there so take coaching center otherwise not
        if (count($this->dashboardOfferedSport())) {
            return [
                "id"             => $this->id,
                "logo"           => generate_url($this->logo),
                "coaching_name"  => $this->coaching_name,
                "address_line_1" => $this->address_line1,
                "address_line_2" => $this->address_line2,
                "city"           => $this->city ? $this->city->name : "",
                "review"         => $this->getCoachingCentreReview(),
                "distance"       => $this->getDistance(),
                "offered_sports" => $this->dashboardOfferedSport(),
            ];
        }
        return null;
    }
}
