<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoachingCentreBannerImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"                 => $this->id,
            // "coaching_centre_id" => $this->coaching_centre_id,
            "image_path"         => generate_url($this->image_path),
            // "is_active"          => $this->is_active,
            "is_banner"          => $this->is_banner,
        ];
    }
}
