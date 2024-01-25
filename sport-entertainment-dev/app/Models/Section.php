<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
	use HasFactory;

    protected $table = "sections";

    protected $fillable = [
        "name", "grouping_name", "icon", "image", "icon_type", "sequence", "is_active",
    ];

    public function roles() : HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function scopeActiveSections($query)
	{
		return $query->with("roles")->where("is_active", "y")->orderBy("sequence", "asc")->get();
	}
}
