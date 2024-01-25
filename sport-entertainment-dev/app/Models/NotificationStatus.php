<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationStatus extends Model
{
    use HasFactory;

    protected $fillable = ['notification_id','user_id','coaching_centre_id','is_read'];
    protected $table = "notification_statuses";
}
