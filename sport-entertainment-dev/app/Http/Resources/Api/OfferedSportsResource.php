<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferedSportsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"   => $this->id,
            "name" => $this->sport ? $this->sport->name : NULL,
            "logo" => $this->sport ? generate_url($this->sport->logo) : NULL,
        ];
    }
}
