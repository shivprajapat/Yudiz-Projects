<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorLog extends Model
{

    protected $fillable = ['first_name', 'email', 'url', 'exception', 'count', 'ip_address', 'guard'];
}
