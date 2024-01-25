<?php

namespace App\Models;

use App\Enums\StatusEnums;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AgeGroup extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'custom_id', 'age_name', 'minimum_age', 'maximum_age', 'is_active'
    ];
    public function batches()
    {
        return $this->hasMany(Batch::class, 'id', 'age_id');
    }

    protected $casts = [
        'status' => StatusEnums::class,
    ];

    function getAgeGroupStatus()
    {
        return $this->is_active  === (StatusEnums::ACTIVE)->value ? __("ACTIVE") : __("INACTIVE");
    }
}
