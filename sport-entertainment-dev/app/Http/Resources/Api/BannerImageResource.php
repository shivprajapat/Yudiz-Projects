<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerImageResource extends JsonResource
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
            "coaching_centre_id" => $this->coaching_centre_id,
            "banner_image"       => generate_url($this->banner_image),
            "banner_type"        => $this->banner_type,
            "redirect_url"       => $this->redirect_url,
            "banner_note"        => $this->banner_note,
            "is_active"          => $this->is_active,
        ];
    }
}
