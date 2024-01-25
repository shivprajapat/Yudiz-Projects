<?php

namespace App\Models;

use App\Enums\FaqTypeEnums;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory,HasUuids;

    protected $fillable = [
        'custom_id',
        'title',
        'description',
        'faq_type',
        'is_active'
    ];

    public function getModifiedFaqAttribute()
    {
          return $this->faq_type == (FaqTypeEnums::END_USER)->value ? 'End User' : 'Coaching Centre' ;
    }
}
