<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "custom_batch_id"     => $this->id,
            "batch_name"          => $this->name,
            "sport_name"          => $this->sport ? $this->sport->name : "",
            "age_group"           => $this->ageGroup ? $this->ageGroup->age_name : "",
            "batch_price"         => $this->price,
            "start_date_end_date" => $this->getStartDateEndDate(),
            "batch_size"          => $this->batch_size,
            "session_timing"      => $this->getStartTimeEndTime(),
            "session_days"        => $this->session_days,
            "total_sessions"      => $this->number_of_session,
            "brief_details"       => $this->brief_details
        ];
    }
}
