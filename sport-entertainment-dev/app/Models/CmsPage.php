<?php

namespace App\Models;

use App\Enums\CmsTypeEnums;
use App\Traits\UUID;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CmsPage extends Model
{
    use HasFactory, SoftDeletes, UUID;

    protected $table = "cms_pages";

    protected $fillable = [
       "id", "edited_by", "title", "slug", "description","cms_type", "file", "is_active"
    ];


    public function editedBy() : BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
