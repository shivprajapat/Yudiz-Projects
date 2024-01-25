<?php

namespace App\Traits;


trait QeueryScopeTrait
{
    public function scopeCoachingId($query)
    {
        return $query->where('coaching_centre_id', auth('coaching')->user()->id);
    }

    public function scopeSportActive($query)
    {
        return $query->where('is_active', '1');
    }
}
