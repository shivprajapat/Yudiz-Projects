<?php

namespace App\Http\Resources\Api;

use App\Enums\GenderEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantResource extends JsonResource
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
            "first_name"     => $this->first_name,
            "last_name"      => $this->last_name,
            "gender"         => $this->getGender(),
            "dob"            => $this->dob,
            "school_name"    => $this->school_name,
            'state_id'       => $this->state_id,
            'city_id'        => $this->city_id,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'pin_code'       => $this->pin_code,
        ];
    }
}
