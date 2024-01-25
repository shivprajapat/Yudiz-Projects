<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Role extends Model
{
    use HasFactory;

    protected $table = "roles";

    protected $fillable = [
        "section_id", "title", "route", "params", "icon", "image", "icon_type", "sequence", "is_active", "allowed_permissions",
    ];

    public function section() : BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function quickLinks() : HasOne
    {
        return $this->hasOne(QuickLink::class, "role_id", "id")->where(["admin_id" => auth()->id()]);
    }

}
