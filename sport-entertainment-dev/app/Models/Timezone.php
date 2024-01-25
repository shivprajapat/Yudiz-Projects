<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timezone extends Model
{
    use HasFactory;

    protected $table = "timezones";

    protected $fillable = [
        "id", "country_id", "name",
    ];

    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
