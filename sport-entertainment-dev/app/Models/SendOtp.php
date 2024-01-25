<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SendOtp extends Model
{
    use HasFactory;
    protected $fillable = ["otp", "mobile_number", "created_at", "updated_at"];
}
