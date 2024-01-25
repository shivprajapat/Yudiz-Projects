<?php

namespace App\Http\Resources\Api;

use App\Enums\GenderEnum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "custom_id"      => $this->custom_id,
            "first_name"     => $this->first_name,
            "last_name"      => $this->last_name,
            "mobile_number"  => $this->mobile_number,
            // "email"          => $this->email,
            "gender"         => $this->gender == GenderEnum::MALE ? "Male" : "Female",
            "dob"            => $this->dob,
            "profile_photo"  => generate_url($this->profile_photo),
            "is_active"      => $this->is_active,
            "payment_id"     => $this->payment_id,
            "state_id"       => $this->state_id,
            "city_id"        => $this->city_id,
            "address_line_1" => $this->address_line_1,
            "address_line_2" => $this->address_line_2,
            "pin_code"       => $this->pin_code,
        ];
    }
}
