<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Content extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = ['slug','content','title'];
}
