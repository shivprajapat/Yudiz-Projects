<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavoriteSport extends Model
{
    use HasFactory;
    protected $fillable = ['sport_id', 'user_id', 'id', 'created_at', 'updated_at'];

}
