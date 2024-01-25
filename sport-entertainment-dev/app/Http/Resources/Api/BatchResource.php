<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"                  => $this->id,
            "name"                => $this->name,
            "start_date_end_date" => $this->getStartDateEndDate(),
            "start_time_end_time" => $this->getStartTimeEndTime(),
            "sport_name"          => $this->sport ? $this->sport->name : "",
            "age_group"           => $this->ageGroup ? $this->ageGroup->age_name : "",
            "price"               => $this->price,
            "number_of_session"   => $this->number_of_session,
            "live_status"         => $this->live_status,
            "completion_status"   => $this->completion_status,
            "extra_msg"           => $this->getExtraMsg(),
            "is_housefull"        => $this->isHouseFullBatch(),

        ];
    }
}
