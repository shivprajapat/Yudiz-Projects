<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgeGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"          => $this->id,
            "age_name"    => $this->age_name,
            "minimum_age" => $this->minimum_age,
            "maximum_age" => $this->maximum_age,
            "is_active"   => $this->getAgeGroupStatus(),
        ];
    }
}
