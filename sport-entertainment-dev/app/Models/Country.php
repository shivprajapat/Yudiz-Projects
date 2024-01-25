<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory;

    protected $table = "countries";

    protected $fillable = [
        "name", "phone_code", "iso2", "iso3", "region", "subregion", "flag_png", "flag_svg", "flag_emoji",
    ];

    public function states() : HasMany
    {
        return $this->hasMany(State::class);
    }

    public function cities() : HasMany
    {
        return $this->hasMany(City::class);
    }

    public function currencies() : HasMany
    {
        return $this->hasMany(Currency::class);
    }

    public function timezones() : HasMany
    {
        return $this->hasMany(Timezone::class);
    }
}
