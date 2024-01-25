<?php

namespace App\Http\Resources\Api;

use App\Enums\GenderEnum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingParticipantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = null;

        $participant = $this->participant ?? $this->participateAsUser;
        if ($participant) {
            $data = [
                "full_name" => $participant->getFullName(),
                "gender"    => $this->getGender(),
                "year"      => yearCount($participant->dob),
                "self_user" => ($participant === $this->participateAsUser),
            ];
        }

        return $data;
    }
}
