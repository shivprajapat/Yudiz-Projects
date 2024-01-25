<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Currency extends Model
{
    use HasFactory;

    protected $table = "currencies";

    protected $fillable = [
        "country_id", "name", "iso3", "precision", "symbol", "symbol_native", "symbol_first", "decimal_mark", "thousands_separator",
    ];

    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
