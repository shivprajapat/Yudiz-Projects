<?php

namespace App\Models;

use App\Enums\StatusEnums;
use App\Traits\QeueryScopeTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sports extends Model
{
    use HasFactory, SoftDeletes, HasUuids, QeueryScopeTrait;
    protected $fillable = ['id', 'name', 'logo', 'is_active', 'is_popular'];

    public function coachingCentres()
    {
        return $this->belongsToMany(CoachingCentre::class, 'coaching_centre_offered_sports', 'sport_id', 'coaching_centre_id');
    }
    public function batches()
    {
        return $this->hasMany(Batch::class, 'sport_id', 'id');
    }
    public function scopeOnlyActive($query)
    {
        return $query->where('is_active', StatusEnums::ACTIVE);
    }
}
